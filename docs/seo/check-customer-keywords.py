"""Read-only checks against an isolated localhost production build, never submit forms."""
from pathlib import Path
import sys
sys.dont_write_bytecode=True
import importlib.util, json, re, urllib.request, urllib.parse, xml.etree.ElementTree as ET, datetime
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('public_audit',ROOT/'docs/seo/verify-submission-urls.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
BASE='http://localhost:3013';ORIGIN='https://visionsecuretech.in'
pages=json.loads((ROOT/'lib/seo-pages.json').read_text())
for slug,title,desc in re.findall(r'slug: "([^"]+)",\s*title: "([^"]+)",\s*excerpt: "([^"]+)"',(ROOT/'lib/blogs.ts').read_text(encoding='utf-8')):pages.append({'path':'/blog/'+slug,'title':title+' | VisionSecure','description':desc,'heading':title})
paths={p['path'] for p in pages};observed={};failures=[];results=[]
for expected in pages:
 path=expected['path']
 with urllib.request.urlopen(BASE+path,timeout=25) as response:html=response.read().decode();status=response.status;headers=response.headers
 p=m.Page();p.feed(html);observed[path]=p
 entities=[]
 for entity in p.ld:entities.extend(entity.get('@graph',[entity]))
 checks={'status':status==200,'title':p.title==expected['title'],'description':p.description==expected['description'],'one_h1':p.h1==[expected['heading']],'canonical':m.equivalent(p.canonical,ORIGIN+path),'indexable':not re.search(r'\b(noindex|none)\b',' '.join(p.robots)+headers.get('X-Robots-Tag','')),'one_business':sum(e.get('@type')=='LocalBusiness' for e in entities)==1,'valid_json_ld':all('parse_error' not in e for e in entities)}
 if path.startswith('/services/'):
  services=[e for e in entities if e.get('@type')=='Service'];checks['service_provider']=len(services)==1 and services[0]['provider']['@id']==ORIGIN+'/#business'
  expected_title=re.search(r'slug: "'+re.escape(path.split('/')[-1])+r'", title: "([^"]+)"',(ROOT/'lib/services.ts').read_text()).group(1)
  checks['service_enquiry']=any(urllib.parse.parse_qs(urllib.parse.urlsplit(l).query).get('service')==[expected_title] for l in p.links)
 unknown=[]
 for link in p.links:
  u=urllib.parse.urlsplit(urllib.parse.urljoin(ORIGIN+path,link))
  if u.netloc=='visionsecuretech.in' and not re.match(r'^/(?:admin|api|profile|register|inquiry)(?:/|$)',u.path):
   if (u.path or '/') not in paths:unknown.append(link)
 checks['public_internal_links']=not unknown
 for name,passed in checks.items():
  if not passed:failures.append(path+': '+name)
 results.append({'path':path,'checks':checks,'unknown_links':unknown,'title':p.title,'description':p.description,'h1':p.h1,'canonical':p.canonical})
markers={'/':'Plan security and networking around your Lucknow property','/services/wifi-mesh-networking':'a range extender repeats','/services/video-door-phone':'doorbell installation is not automatically included','/services/smart-door-locks':'model-specific backup entry','/services/home-automation':'Smart lighting focuses','/services/access-control-system':'how lost access is revoked','/services/speaker-solutions':'not a certified emergency voice alarm','/services/glass-break-alarm-system':'not interchangeable','/services/emergency-alarm-system':'does not establish fire-safety compliance'}
for path,phrase in markers.items():
 if phrase not in ' '.join(observed[path].text):failures.append(path+': new content absent from HTML')
with urllib.request.urlopen(BASE+'/sitemap.xml') as response:urls=[e.text for e in ET.fromstring(response.read()).iter() if e.tag.endswith('loc')]
assert len(urls)==len(set(urls))==len(paths) and set(urls)=={ORIGIN+p for p in paths}
report={'verified_at_ist':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=5,minutes=30))).isoformat(),'scope':'Isolated localhost build; response HTML, no form submissions','public_count':len(paths),'sitemap_count':len(urls),'new_content_markers':markers,'pages':results,'failures':failures}
(ROOT/'docs/seo/customer-keyword-render-checks.json').write_text(json.dumps(report,indent=2)+'\n')
assert not failures,failures
print(f'PASS: {len(paths)} public pages, metadata/H1/canonical/JSON-LD, public links, 13 service enquiry destinations, {len(markers)} new content markers, discovered sitemap count {len(urls)}')
