"""Bounded read-only audit. Only same-site public catalogue/sitemap URLs are fetched."""
import concurrent.futures, datetime, json, re, urllib.error, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/seo'
ORIGIN = 'https://visionsecuretech.in'
STAMP = datetime.datetime.now(datetime.timezone.utc).isoformat()
DATE = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=5, minutes=30))).date().isoformat()
def safe(url):
 p = urllib.parse.urlsplit(url)
 return p.scheme in ('http', 'https') and p.hostname in ('visionsecuretech.in', 'www.visionsecuretech.in') and not p.query and not p.fragment and not re.match(r'^/(?:admin|api|profile|register|inquiry)(?:/|$)', p.path)

def equivalent(a,b):
 # An empty HTTP root path and '/' identify the same resource. Preserve all
 # other path distinctions rather than assuming trailing slashes are equivalent.
 x,y=urllib.parse.urlsplit(a),urllib.parse.urlsplit(b)
 return (x.scheme,x.netloc,x.path or '/',x.query,x.fragment)==(y.scheme,y.netloc,y.path or '/',y.query,y.fragment)

class Redirects(urllib.request.HTTPRedirectHandler):
 def __init__(self): self.chain = []
 def redirect_request(self, req, fp, code, msg, headers, newurl):
  if len(self.chain) >= 5 or not safe(newurl): raise ValueError('Redirect outside public audit boundary')
  self.chain.append({'status': code, 'destination': newurl})
  return super().redirect_request(req, fp, code, msg, headers, newurl)

class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True)
  self.title='';self.h1=[];self.description='';self.canonical='';self.robots=[];self.links=[];self.ld=[];self.text=[];self.capture='';self.hidden=0;self.script=''
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if tag=='title':self.capture='title'
  if tag=='h1':self.capture='h1';self.h1.append('')
  if tag=='meta' and a.get('name','').lower()=='description':self.description=a.get('content','')
  if tag=='meta' and a.get('name','').lower() in ('robots','googlebot','bingbot','oai-searchbot'):self.robots.append(a.get('name')+': '+a.get('content',''))
  if tag=='link' and 'canonical' in a.get('rel','').split():self.canonical=a.get('href','')
  if tag=='a':self.links.append(a.get('href',''))
  if tag in ('script','style'):self.hidden+=1
  if tag=='script' and a.get('type')=='application/ld+json':self.script='';self.capture='ld'
 def handle_endtag(self, tag):
  if tag=='script' and self.capture=='ld':
   try:self.ld.append(json.loads(self.script))
   except ValueError:self.ld.append({'parse_error':True})
   self.capture=''
  if tag in ('script','style'):self.hidden=max(0,self.hidden-1)
  if tag in ('title','h1'):self.capture=''
 def handle_data(self, data):
  if self.capture=='ld':self.script+=data
  elif self.capture=='title':self.title+=data
  elif self.capture=='h1':self.h1[-1]+=data
  if not self.hidden:self.text.append(data)

def get(url, ua='VisionSecure-SEO-ReadOnly/1.0'):
 if not safe(url): raise ValueError('Not an allowed public URL')
 handler=Redirects();row={'url':url,'status':'Not verified','redirect_chain':[],'final_destination':'Not verified','canonical':'Not verified','meta_robots':'Not verified','x_robots_tag':'Not verified','verification_date':DATE,'timestamp_utc':STAMP,'method':'Read-only HTTP GET; response HTML parsing (not JS execution)','issue':''}
 try:
  with urllib.request.build_opener(handler).open(urllib.request.Request(url,headers={'User-Agent':ua,'Accept-Encoding':'identity'}),timeout=18) as r:
   body=r.read(2500001)
   if len(body)>2500000:raise ValueError('Response exceeds bounded read limit')
   row.update(status=r.status,final_destination=r.url,content_type=r.headers.get('Content-Type',''),x_robots_tag=r.headers.get('X-Robots-Tag',''),body=body.decode('utf-8','replace'))
 except urllib.error.HTTPError as e:row.update(status=e.code,final_destination=e.url,issue=f'HTTP {e.code}; no indexability assumption')
 except Exception as e:row['issue']='Not verified: '+type(e).__name__+': '+str(e)[:180]
 row['redirect_chain']=handler.chain
 if row.get('body') and 'text/html' in row.get('content_type',''):
  p=Page();p.feed(row['body']);row.update(title=p.title.strip(),description=p.description,h1=[' '.join(x.split()) for x in p.h1],canonical=p.canonical,meta_robots='; '.join(p.robots),internal_links=sorted(set(x for x in p.links if x.startswith('/') and not x.startswith('//'))),json_ld=p.ld,readable_text=' '.join(' '.join(p.text).split())[:65000])
 row.pop('body',None) if row.get('content_type','').startswith('text/html') else None
 return row

def allowed(text, agent, path):
 groups=[];agents=[];rules=[]
 for line in text.splitlines()+['User-agent: END']:
  line=line.split('#',1)[0].strip()
  if ':' not in line:continue
  key,value=[x.strip() for x in line.split(':',1)];key=key.lower()
  if key=='user-agent':
   if rules:groups.append((agents,rules));agents=[];rules=[]
   agents.append(value.lower())
  elif key in ('allow','disallow') and agents and value:rules.append((key,value))
 candidates=[(max((len(a) for a in agents if a!='*' and a in agent.lower()),default=0),agents,rules) for agents,rules in groups]
 specificity=max((x[0] for x in candidates),default=0)
 selected=[x for x in candidates if x[0]==specificity and (specificity or '*' in x[1])]
 matches=[]
 for _,_,rules in selected:
  for key,pattern in rules:
   regex='^'+re.escape(pattern).replace(r'\*','.*').replace(r'\$','$')
   if re.search(regex,path):matches.append((len(pattern.replace('*','').replace('$','')),key=='allow'))
 return max(matches,default=(0,True))[1]

def main():
 pages=json.loads((ROOT/'lib/seo-pages.json').read_text(encoding='utf-8-sig'))
 for m in re.finditer(r'slug: "([^"]+)",\s*title: "([^"]+)",\s*excerpt: "([^"]+)"',(ROOT/'lib/blogs.ts').read_text(encoding='utf-8-sig')):
  slug,title,desc=m.groups();pages.append({'path':'/blog/'+slug,'title':title+' | VisionSecure','description':desc,'source':'lib/blogs.ts','type':'blog'})
 sources={ORIGIN+p['path']:[p.get('source','lib/seo-pages.json'),'lib/seo-pages.json' if p.get('type')!='blog' else 'lib/blogs.ts'] for p in pages}
 robots=get(ORIGIN+'/robots.txt');sitemap=get(ORIGIN+'/sitemap.xml');members=[]
 if sitemap['status']==200:
  try:members=[x.text.strip() for x in ET.fromstring(sitemap.get('body','')).iter() if x.tag.endswith('loc') and x.text]
  except ET.ParseError:sitemap['issue']='Not verified: invalid sitemap XML'
 for u in members:
  if safe(u):sources.setdefault(u,[]).append('Live sitemap')
 prior=OUT/'public-urls.txt'
 if prior.exists():
  for u in prior.read_text(encoding='utf-8-sig').splitlines():
   if safe(u):sources.setdefault(u,[]).append('Historical public-urls.txt')
 if len(sources)>60:raise ValueError('Unexpected public inventory size; manual review required')
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:rows=list(pool.map(get,sources))
 for i,r in enumerate(rows):
  r['initial_issue']=r['issue']
  if r['status']=='Not verified':rows[i]=get(r['url']);rows[i]['initial_issue']=r['issue'];rows[i]['method']+='; one retry after initial failure'
 bypath={ORIGIN+p['path']:p for p in pages}
 for r in rows:
  r['source']='; '.join(dict.fromkeys(sources[r['url']]))
  r['sitemap_membership']='Yes' if r['url'] in members else ('No' if sitemap['status']==200 else 'Not verified')
  r['robots_allowed']=allowed(robots.get('body',''),'generic',urllib.parse.urlsplit(r['url']).path) if robots['status']==200 else None
  r['local_metadata_differs']=r['url'] in bypath and (r.get('title')!=bypath[r['url']].get('title') or r.get('description')!=bypath[r['url']].get('description'))
  directives=(r.get('meta_robots','')+' '+r.get('x_robots_tag','')).lower()
  # Only an observed self-canonical, successful, crawlable HTML response enters a submission file.
  verified=r['status']==200 and 'text/html' in r.get('content_type','') and equivalent(r.get('canonical',''),r['url']) and equivalent(r['url'],r['final_destination']) and not re.search(r'\b(noindex|none)\b',directives) and r['robots_allowed'] is True
  r['category']='A: Verified live canonical public page' if verified else ('B: Local route not live (404 observed)' if r['status']==404 and r['url'] in bypath else 'C: Excluded or not verified')
  r['treatment']='Eligible for submission; indexing not established' if verified else 'Do not submit until issue verified/resolved'
  if not verified and not r['issue']:r['issue']='Check canonical, final destination, HTML type and indexability directives'
 priorities=['/','/services/cctv-surveillance','/services/networking-solutions','/services/biometric-attendance','/services/it-support-amc','/contact']
 bots=[]
 for agent,ua in [('Googlebot','Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),('Bingbot','Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'),('OAI-SearchBot','OAI-SearchBot/1.0; +https://openai.com/searchbot')]:
  for path in priorities:
   result=get(ORIGIN+path,ua);bots.append({k:v for k,v in result.items() if k not in ('readable_text','json_ld','internal_links')})
   bots[-1].update(agent=agent,robots_allowed=allowed(robots.get('body',''),agent,path) if robots['status']==200 else None,method='Read-only GET with declared user-agent; not an authenticated crawler-IP test')
 aliases=[get(u) for u in ['http://visionsecuretech.in/','https://www.visionsecuretech.in/','http://www.visionsecuretech.in/']]
 evidence={'verification_date':DATE,'timestamp_utc':STAMP,'local_count':len(pages),'local_urls':[ORIGIN+p['path'] for p in pages],'live_sitemap_urls':members,'robots':robots,'sitemap':sitemap,'pages':rows,'redirect_checks':aliases,'crawler_checks':bots,'request_bound':'2 discovery requests + <=60 catalogue/sitemap pages; one retry per transport failure; 18 representative bot-UA checks; 3 root redirect aliases; <=3 concurrent requests'}
 (OUT/'url-verification-evidence.json').write_text(json.dumps(evidence,indent=2,ensure_ascii=False),encoding='utf-8')
 print(json.dumps({'local_pages':len(pages),'sitemap_urls':len(members),'checked_pages':len(rows),'verified_canonical':sum(r['category'].startswith('A:') for r in rows),'failures':[(r['url'],r['status'],r['issue']) for r in rows if not r['category'].startswith('A:')],'bot_checks':len(bots)},indent=2))
if __name__=='__main__':main()
