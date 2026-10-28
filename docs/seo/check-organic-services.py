from pathlib import Path
from html.parser import HTMLParser
import json,re,urllib.request,urllib.error,urllib.parse,concurrent.futures,datetime,subprocess,argparse
args=argparse.ArgumentParser();args.add_argument('--origin',default='http://localhost:3013');args.add_argument('--live',action='store_true');options=args.parse_args()
CANONICAL='https://visionsecuretech.in';base=options.origin.rstrip('/')
cat=json.loads(Path('docs/seo/organic-catalogue.json').read_text());catalogue={s['slug']:s for s in cat['services']}
pages=json.loads(Path('lib/seo-pages.json').read_text())
for slug,title,excerpt in re.findall(r'slug: "([^"]+)",\s*title: "([^"]+)",\s*excerpt: "([^"]+)"',Path('lib/blogs.ts').read_text(encoding='utf-8')):pages.append(dict(path='/blog/'+slug,title=title+' | VisionSecure',description=excerpt,heading=title,type='blog'))
class Document(HTMLParser):
 def __init__(self):super().__init__();self.capture=None;self.h1=[];self.title='';self.description='';self.canonical='';self.robots=[];self.links=[];self.text=[];self.skip=0;self.schema_buffer=None;self.schemas=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['script','style','template']:self.skip+=1
  if tag=='script' and a.get('type')=='application/ld+json':self.schema_buffer=''
  if tag=='title':self.capture='title'
  if tag=='h1':self.capture='h1';self.h1.append('')
  if tag=='meta' and a.get('name')=='description':self.description=a.get('content','')
  if tag=='meta' and a.get('name') in ['robots','googlebot']:self.robots.append(a.get('content',''))
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='a':self.links.append(a.get('href',''))
 def handle_data(self,value):
  if self.schema_buffer is not None:self.schema_buffer+=value
  if not self.skip:self.text.append(value)
  if self.capture=='title':self.title+=value
  if self.capture=='h1':self.h1[-1]+=value
 def handle_endtag(self,tag):
  if tag=='script' and self.schema_buffer is not None:self.schemas.append(json.loads(self.schema_buffer));self.schema_buffer=None
  if tag in ['script','style','template']:self.skip-=1
  if tag in ['title','h1']:self.capture=None
class Redirects(urllib.request.HTTPRedirectHandler):
 def __init__(self):self.chain=[]
 def redirect_request(self,req,fp,code,msg,headers,newurl):self.chain.append(dict(status=code,destination=newurl));return super().redirect_request(req,fp,code,msg,headers,newurl)
def request(path):
 redirects=Redirects()
 with urllib.request.build_opener(redirects).open(urllib.request.Request(base+path,headers={'User-Agent':'VisionSecure-ReadOnly-Verification/1.0'}),timeout=18) as response:return response.status,response.url,response.read(2500000).decode('utf-8',errors='replace'),response.headers.get('X-Robots-Tag',''),redirects.chain
service_titles={s['title'] for s in cat['services']};known={p['path'] for p in pages};results=[]
def check(expected):
 path=expected['path'];row=dict(path=path,requested_url=base+path,checked_at_utc=datetime.datetime.now(datetime.timezone.utc).isoformat())
 try:
  status,final,html,header,chain=request(path);doc=Document();doc.feed(html);text=' '.join(' '.join(doc.text).split());entities=[e for s in doc.schemas for e in s.get('@graph',[s])]
  row.update(status=status,final_url=final,redirects=chain,title=doc.title,description=doc.description,h1=doc.h1,canonical=doc.canonical,robots=doc.robots,x_robots_tag=header,schema_types=[e.get('@type') for e in entities])
  if not options.live:
   checks=dict(status_200=status==200,title=doc.title==expected['title'],description=doc.description==expected['description'],one_stable_h1=doc.h1==[expected['heading']],canonical=doc.canonical.rstrip('/')==(CANONICAL+path).rstrip('/'),indexable=all('noindex' not in r for r in doc.robots+[header]),one_business=len([e for e in entities if e.get('@type')=='LocalBusiness'])==1,unique_entities=len([e.get('@id') for e in entities])==len({e.get('@id') for e in entities}))
   unknown=[urllib.parse.urlsplit(link).path for link in doc.links if link.startswith('/') and not link.startswith('//') and urllib.parse.urlsplit(link).path not in known and not urllib.parse.urlsplit(link).path.startswith(('/admin','/api','/profile','/register'))];checks['public_internal_links']=not unknown
   service_values=[urllib.parse.parse_qs(urllib.parse.urlsplit(link).query).get('service',[''])[0] for link in doc.links if link.startswith('/contact?service=')];checks['enquiry_values']=all(value in service_titles for value in service_values)
   if expected['type']=='service':
    slug=path.split('/')[-1];service=catalogue[slug];qs=cat['buyer_guides'].get(slug,[])+service['faqs'];schemas=[e for e in entities if e.get('@type')=='Service'];checks.update(service_faqs=all(q['question'] in text and q['answer'] in text for q in qs),service_explanation=service['summary'] in text,related_links=all('/services/'+r in doc.links for r in cat['related'][slug]),preselected_enquiry=service['title'] in service_values,service_schema=len(schemas)==1 and schemas[0]['provider']=={'@id':CANONICAL+'/#business'} and schemas[0]['description']==service['summary']);row['question_count']=len(qs);row['related_services']=cat['related'][slug]
   row['checks']=checks;row['outcome']='Pass' if all(checks.values()) else 'Fail'
  else:row['outcome']='Observed production response; not evidence of indexing/ranking or local deployment'
 except Exception as error:row.update(outcome='Not verified',limitation=str(error)[:240])
 return row
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(check,pages))
resources={}
for path in ['/robots.txt','/sitemap.xml']:
 try:
  status,final,text,header,chain=request(path);resources[path]=dict(status=status,final_url=final,text=text,redirects=chain)
 except Exception as error:resources[path]=dict(status='Not verified',limitation=str(error)[:240])
robots=resources.get('/robots.txt',{}).get('text');crawler={}
def can_crawl_current_rules(text, agent, path):
 # These checks deliberately cover the current single wildcard group only.
 # A new specific agent group needs explicit review rather than silently
 # treating Python robotparser's first-match behaviour as Google precedence.
 groups=[line.split(':',1)[1].strip() for line in text.splitlines() if line.lower().startswith('user-agent:')]
 assert groups==['*'], 'Crawler-specific groups require a matching-policy review'
 matches=[]
 for line in text.splitlines():
  field,separator,value=line.partition(':');value=value.split('#',1)[0].strip()
  if separator and field.lower() in ['allow','disallow'] and value:
   assert '*' not in value and '$' not in value, 'Wildcard path rules require explicit matching tests'
   if path.startswith(value):matches.append((len(value.encode('utf-8')),field.lower()=='allow'))
 return max(matches,default=(0,True))[1]
if robots:
 # Longest matching path wins; Allow wins equal-length ties.
 assert not can_crawl_current_rules('User-agent: *\nAllow: /\nDisallow: /admin/','Googlebot','/admin/login')
 assert can_crawl_current_rules('User-agent: *\nAllow: /\nDisallow: /admin/','Googlebot','/services/example')
 for agent in ['Googlebot','OAI-SearchBot','GPTBot']:
  crawler[agent]=dict(public_rules_allow_all=all(can_crawl_current_rules(robots,agent,p['path']) for p in pages),private_path_rules_block=all(not can_crawl_current_rules(robots,agent,p) for p in ['/admin/login','/api/leads','/profile','/register']))

report=dict(verification_date='2026-10-28',scope='Observed production only' if options.live else 'Local isolated build; not deployed',source_base='f4cb2dc',derived_public_count=len(pages),derived_service_count=len(catalogue),pages=results,resources=resources,crawler_rules=crawler,crawler_ip_access='Not verified; no authorised hosting logs',training_preference='GPTBot policy retained; distinct from OAI-SearchBot search access')
if not options.live:
 urls=re.findall(r'<loc>(.*?)</loc>',resources.get('/sitemap.xml',{}).get('text',''));expected={CANONICAL+p['path'] for p in pages};baseline=set(subprocess.check_output(['git','show','f4cb2dc:docs/seo/public-urls.txt'],text=True).splitlines());report['sitemap_count']=len(urls);report['routes_unchanged']=set(urls)==expected==baseline;report['passed']=all(r.get('outcome')=='Pass' for r in results) and report['routes_unchanged'] and all(c['public_rules_allow_all'] and c['private_path_rules_block'] for c in crawler.values()) and len(crawler)==3
output=Path('docs/seo/organic-live-checks.json' if options.live else 'docs/seo/organic-render-checks.json');output.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(output=str(output),public_pages=len(pages),services=len(catalogue),passed=report.get('passed'),outcomes={kind:sum(r['outcome']==kind for r in results) for kind in set(r['outcome'] for r in results)})))
if not options.live:assert report['passed'],[(r['path'],r.get('checks'),r.get('limitation')) for r in results if r['outcome']!='Pass']
