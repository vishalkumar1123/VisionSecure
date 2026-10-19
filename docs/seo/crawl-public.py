from pathlib import Path
import json,re,csv,urllib.request,concurrent.futures,datetime
from html.parser import HTMLParser
out=Path('docs/seo');pages=json.loads(Path('lib/seo-pages.json').read_text())
for m in re.finditer(r'slug: "([^"]+)",\s*title: "([^"]+)",\s*excerpt: "([^"]+)"',Path('lib/blogs.ts').read_text(encoding='utf-8')):
 slug,title,desc=m.groups();pages.append(dict(path='/blog/'+slug,title=title+' | VisionSecure',description=desc,heading=title,type='blog',source='lib/blogs.ts',intent=title))
origin='https://visionsecuretech.in';(out/'public-urls.txt').write_text('\n'.join(origin+p['path'] for p in pages)+'\n');(out/'local-pages.json').write_text(json.dumps(pages,indent=2))
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.title='';self.h1=[];self.desc='';self.canonical='';self.robots=[];self.capture='';self.links=[];self.images=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='title':self.capture='title'
  if tag=='h1':self.capture='h1';self.h1.append('')
  if tag=='meta' and a.get('name')=='description':self.desc=a.get('content','')
  if tag=='meta' and a.get('name') in ['robots','googlebot']:self.robots.append(a.get('content',''))
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='img':self.images.append(a.get('src',''))
 def handle_data(self,data):
  if self.capture=='title':self.title+=data
  if self.capture=='h1':self.h1[-1]+=data
 def handle_endtag(self,tag):
  if tag in ['title','h1']:self.capture=''
class Redirects(urllib.request.HTTPRedirectHandler):
 def __init__(self):self.chain=[]
 def redirect_request(self,req,fp,code,msg,headers,newurl):self.chain.append(str(code)+' '+newurl);return super().redirect_request(req,fp,code,msg,headers,newurl)
def check(url):
 handler=Redirects();row=dict(requested_url=url,http_status='Not verified',redirect_chain='',final_destination='Not verified',live_title='Not verified',live_description='Not verified',live_heading='Not verified',live_canonical='Not verified',observed_directives='Not verified',timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),outcome='Not verified')
 try:
  with urllib.request.build_opener(handler).open(urllib.request.Request(url,headers={'User-Agent':'VisionSecure-SEO-ReadOnly/1.0'}),timeout=12) as response:
   parser=Parser();parser.feed(response.read(2500000).decode('utf-8',errors='replace'));row.update(http_status=response.status,redirect_chain=' -> '.join(handler.chain),final_destination=response.url,live_title=parser.title,live_description=parser.desc,live_heading=' | '.join(parser.h1),live_canonical=parser.canonical,observed_directives='; '.join(parser.robots+[response.headers.get('X-Robots-Tag','')]).strip('; '),outcome='Observed production response; indexing not established')
 except Exception as e:row['outcome']='Not verified: '+str(e)[:220]
 return row
if __name__=='__main__':
 urls=[origin+p['path'] for p in pages]+['http://visionsecuretech.in/','http://www.visionsecuretech.in/','https://www.visionsecuretech.in/']
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:results=list(executor.map(check,urls))
 with (out/'live-url-checks.csv').open('w',newline='',encoding='utf-8-sig') as f:w=csv.DictWriter(f,fieldnames=results[0].keys());w.writeheader();w.writerows(results)
 print('Discovered',len(pages),'public pages;',sum(r['http_status']!='Not verified' for r in results),'live responses;',len(results),'read-only requests.')
