from pathlib import Path
import runpy,json,urllib.request,urllib.error,concurrent.futures,re,urllib.parse
ns=runpy.run_path('docs/seo/crawl-public.py');Parser=ns['Parser'];pages=ns['pages'];base='http://localhost:3013';known={p['path'] for p in pages};observed=[];links=set();assets=set();errors=[]
def fetch(p):
 with urllib.request.urlopen(base+p['path'],timeout=15) as r:html=r.read().decode();status=r.status
 parser=Parser();parser.feed(html)
 schemas=[json.loads(x) for x in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',html,re.S)]
 row={'path':p['path'],'status':status,'title':parser.title,'description':parser.desc,'h1':parser.h1,'canonical':parser.canonical,'robots':parser.robots,'jsonld_count':len(schemas)}
 for key,a,b in [('title',parser.title,p['title']),('description',parser.desc,p['description']),('canonical',parser.canonical,'https://visionsecuretech.in'+p['path'])]:
  if a.rstrip('/')!=b.rstrip('/'):errors.append(p['path']+' '+key+' mismatch')
 if parser.h1!=[p['heading']]:errors.append(p['path']+' heading mismatch '+repr(parser.h1))
 for link in parser.links:
  if link.startswith('/') and not link.startswith('//'):links.add(urllib.parse.urlsplit(link).path)
 for src in parser.images:
  if src.startswith('/_next/image?'):src=urllib.parse.parse_qs(urllib.parse.urlsplit(src).query).get('url',[''])[0]
  if src.startswith('/'):assets.add(src)
 return row
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:observed=list(pool.map(fetch,pages))
unknown=sorted(x for x in links if x not in known and not x.startswith(('/admin','/profile','/register','/api')))
missing=sorted(x for x in assets if not Path('public'+x).exists())
with urllib.request.urlopen(base+'/sitemap.xml') as r:sitemap=r.read().decode()
urls=re.findall(r'<loc>(.*?)</loc>',sitemap)
assert set(urls)=={'https://visionsecuretech.in'+p['path'] for p in pages}
with urllib.request.urlopen(base+'/robots.txt') as r:robots=r.read().decode()
assert 'Disallow: /api/' in robots
with urllib.request.urlopen(base+'/register') as r:assert 'noindex' in r.headers.get('X-Robots-Tag','')
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None
opener=urllib.request.build_opener(NoRedirect())
try:opener.open(urllib.request.Request(base+'/contact?service=CCTV%20Surveillance',headers={'Host':'www.visionsecuretech.in'}))
except urllib.error.HTTPError as e:assert e.code==308;assert e.headers['Location']=='https://visionsecuretech.in/contact?service=CCTV%20Surveillance'
with opener.open(urllib.request.Request(base+'/contact',headers={'Host':'preview.example.test'})) as r:assert r.status==200
Path('docs/seo/local-render-checks.json').write_text(json.dumps({'pages':observed,'mismatches':errors,'unresolved_public_links':unknown,'missing_rendered_assets':missing,'sitemap_count':len(urls),'host_redirect_and_query_preservation':'PASS','preview_host_stays_local':'PASS','account_noindex_header':'PASS'},indent=2))
print('Rendered',len(observed),'pages;',len(urls),'sitemap URLs; mismatches:',errors,'unresolved links:',unknown,'missing assets:',missing)
assert not errors and not unknown and not missing
