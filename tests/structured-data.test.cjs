const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const test = require('node:test')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const cache = new Map()
function load(filename) {
  const file = path.resolve(filename)
  if (cache.has(file)) return cache.get(file)
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  const loaded = { exports: {} }
  const localRequire = name => {
    if (!name.startsWith('@/') && !name.startsWith('.')) return require(name)
    const base = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file), name)
    return load([base, base + '.ts', base + '.tsx', base + '.json'].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()))
  }
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(localRequire, loaded, loaded.exports)
  cache.set(file, loaded.exports)
  return loaded.exports
}
const { BUSINESS_ID, localBusinessSchema: business, websiteSchema, siteSchema, serviceSchema, serializeJsonLd } = load('lib/schema.ts')
const { services } = load('lib/services.ts')
const { JsonLd } = load('components/json-ld.tsx')
const { default: Schema } = load('components/schema.tsx')
function scripts(html) { return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1])) }

test('one business identity replaces Organization and WebSite references its publisher', () => {
  const graph = scripts(renderToStaticMarkup(React.createElement(Schema)))[0]['@graph']
  assert.equal(graph.filter(entity => entity['@type'] === 'LocalBusiness').length, 1)
  assert.equal(graph.filter(entity => entity['@type'] === 'Organization').length, 0)
  assert.equal(new Set(graph.map(entity => entity['@id'])).size, graph.length)
  assert.equal(business['@id'], BUSINESS_ID)
  assert.equal(websiteSchema.publisher['@id'], BUSINESS_ID)
})

test('business contacts/address and owner-confirmed hours agree with existing visible content', () => {
  const home = fs.readFileSync('components/contact-section.tsx', 'utf8')
  const contact = fs.readFileSync('components/contact-page-content.tsx', 'utf8')
  for (const source of [home, contact]) {
    assert(source.includes('tel:' + business.telephone))
    assert(source.includes(business.email))
    for (const field of ['153, Pili Market, Near Ram Lal Marriage Lawn', 'Narouna, Kakori Mod, Mohan Road', business.address.addressLocality, business.address.addressRegion, business.address.postalCode]) assert(source.includes(field))
  }
  assert(contact.includes('Monday - Saturday : 9:00 AM - 8:30 PM'))
  assert(contact.includes('Sunday : 10:00 AM - 4:00 PM'))
  const hours = business.openingHoursSpecification
  assert.deepEqual(hours[0].dayOfWeek.map(day => day.split('/').pop()), ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  assert.deepEqual([hours[0].opens, hours[0].closes], ['09:00', '20:30'])
  assert.deepEqual([hours[1].dayOfWeek, hours[1].opens, hours[1].closes], [['https://schema.org/Sunday'], '10:00', '16:00'])
  assert.equal(business.address['@type'], 'PostalAddress')
  assert.equal(business.address.addressCountry, 'IN')
})

test('all 13 real Service entities match their catalogue and reference the same existing business', () => {
  const ids = new Set()
  for (const service of services) {
    const schema = serviceSchema(service)
    assert.equal(schema['@type'], 'Service')
    assert.equal(schema.name, service.title)
    assert.equal(schema.description, service.summary)
    assert.equal(schema.url, 'https://visionsecuretech.in/services/' + service.slug)
    assert.equal(schema.mainEntityOfPage, schema.url)
    assert.equal(schema.provider['@id'], business['@id'])
    assert.deepEqual(Object.keys(schema.provider), ['@id'])
    assert(!ids.has(schema['@id'])); ids.add(schema['@id'])
    const rendered = scripts(renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(Schema), React.createElement(JsonLd, { data: schema }))))
    assert.equal(rendered.length, 2)
    assert.equal(rendered[1].provider['@id'], rendered[0]['@graph'][0]['@id'])
    fs.accessSync(path.join('public', service.image))
  }
  assert.equal(ids.size, 13)
})

test('unverified business claims and coverage are absent from all entities', () => {
  const disallowed = new Set(['geo', 'latitude', 'longitude', 'aggregateRating', 'review', 'hasCredential', 'award', 'areaServed', 'serviceArea', 'priceRange', 'sameAs'])
  function check(value) {
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) { assert(!disallowed.has(key), `Unverified property: ${key}`); check(child) }
  }
  check(siteSchema); services.forEach(service => check(serviceSchema(service)))
})

test('hostile text cannot terminate a JSON-LD script and values survive serialization', () => {
  const input = { text: '</script><script>alert("x")</script>& >\u2028\u2029', nested: { title: 'हिन्दी < test' } }
  const serialized = serializeJsonLd(input)
  assert(!/[<>&\u2028\u2029]/u.test(serialized))
  assert.deepEqual(JSON.parse(serialized), input)
  const html = renderToStaticMarkup(React.createElement(JsonLd, { data: input }))
  assert.equal((html.match(/<script/g) || []).length, 1)
  assert.deepEqual(scripts(html), [input])
  assert.throws(() => serializeJsonLd(undefined), TypeError)
})
