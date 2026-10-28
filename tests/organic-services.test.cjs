const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict')
function load(file,mocks={}){const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;const out={exports:{}};vm.runInThisContext(`(function(require,module,exports){${source}\n})`,{filename:file})(name=>Object.hasOwn(mocks,name)?mocks[name]:require(name),out,out.exports);return out.exports}
const {services,relatedServiceSlugs}=load('lib/services.ts'),{serviceBuyerGuides}=load('lib/service-buyer-guides.ts')
const pages=JSON.parse(fs.readFileSync('lib/seo-pages.json','utf8')),slugs=new Set(services.map(s=>s.slug))
for(const service of services){
 const page=pages.find(p=>p.path==='/services/'+service.slug);assert(page);assert(page.description.includes('Lucknow'));assert(page.heading.includes('Lucknow'))
 assert((serviceBuyerGuides[service.slug]||service.faqs).length>=3)
 const related=relatedServiceSlugs[service.slug];assert.equal(related.length,3);assert.equal(new Set(related).size,3);assert(related.every(slug=>slug!==service.slug&&slugs.has(slug)))
}
assert.equal(Object.keys(serviceBuyerGuides).length,4,'retain four earlier guides without creating duplicates')
assert(services.find(s=>s.slug==='speaker-solutions').faqs.some(f=>f.answer.includes('fire-safety')))
assert(services.find(s=>s.slug==='emergency-alarm-system').faqs.some(f=>f.answer.includes('not a substitute')))
assert.equal(new Set(pages.map(p=>p.description)).size,pages.length)
console.log('PASS all real service intents, useful FAQ coverage, related links, retained buyer guides and PA/emergency scope caveats.')
