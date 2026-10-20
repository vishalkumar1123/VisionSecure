from pathlib import Path
from html.parser import HTMLParser
import json,re,urllib.request,urllib.parse,datetime,subprocess
BASE='http://localhost:3013';ORIGIN='https://visionsecuretech.in'
phrases={
'/':['security system installation','office networking','smart home installation'],
'/services/cctv-surveillance':['IP camera installation','CCTV recording storage','CCTV remote viewing setup'],
'/services/biometric-attendance':['fingerprint attendance system','face recognition attendance system','attendance software integration'],
'/services/networking-solutions':['LAN cabling installation','office network setup','structured cabling testing'],
'/services/it-support-amc':['CCTV maintenance contract','IT AMC service','network troubleshooting'],
'/contact':['installation quotation','site assessment enquiry','maintenance enquiry']}
class Page(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.text=[];self.title=[];self.h1=[];self.capture=None;self.description='';self.canonical='';self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['script','style','template']:self.skip+=1
  if tag=='title':self.capture='title'
  if tag=='h1':self.capture='h1';self.h1.append('')
  if tag=='meta' and a.get('name')=='description':self.description=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='a':self.links.append(a.get('href',''))
 def handle_endtag(self,tag):
  if tag in ['script','style','template']:self.skip-=1
  if tag in ['h1','title']:self.capture=None
 def handle_data(self,data):
  if not self.skip:self.text.append(data)
  if self.capture=='title':self.title.append(data)
  if self.capture=='h1':self.h1[-1]+=data
pages=json.loads(Path('lib/seo-pages.json').read_text())
for slug,title,excerpt in re.findall(r'slug: "([^"]+)",\s*title: "([^"]+)",\s*excerpt: "([^"]+)"',Path('lib/blogs.ts').read_text(encoding='utf-8')):pages.append(dict(path='/blog/'+slug,title=title+' | VisionSecure',description=excerpt,heading=title))
service_titles=set(re.findall(r'slug: "[^"]+", title: "([^"]+)"',Path('lib/services.ts').read_text(encoding='utf-8')))
results=[];observed={};failures=[]
for expected in pages:
 path=expected['path']
 with urllib.request.urlopen(BASE+path,timeout=20) as response:status=response.status;html=response.read().decode()
 page=Page();page.feed(html);observed[path]=page
 visible=' '.join(' '.join(page.text).split()).casefold()
 service_links=[href for href in page.links if href.startswith('/contact?service=')]
 checks={'status_200':status==200,'title_matches':''.join(page.title)==expected['title'],'description_matches':page.description==expected['description'],'single_correct_h1':page.h1==[expected['heading']],'canonical_matches':page.canonical.rstrip('/')==(ORIGIN+path).rstrip('/'),'supporting_phrases_in_text_outside_scripts':all(phrase.casefold() in visible for phrase in phrases.get(path,[])),'service_enquiry_values_valid':all(urllib.parse.parse_qs(urllib.parse.urlsplit(href).query).get('service',[''])[0] in service_titles for href in service_links)}
 for check,passed in checks.items():
  if not passed:failures.append(path+': '+check)
 results.append(dict(path=path,checks=checks,title=''.join(page.title),description=page.description,h1=page.h1,canonical=page.canonical,supporting_phrases=phrases.get(path,[]),contextual_service_enquiry_links=service_links))
for target in ['/services/cctv-surveillance','/services/networking-solutions','/services/home-automation']:assert target in observed['/'].links
blog='/blog/networking-structured-cabling-and-server-setup-guide'
for target in ['/services/networking-solutions','/services/server-networking-infrastructure','/contact?service=Networking%20Solutions']:assert target in observed[blog].links
with urllib.request.urlopen(BASE+'/sitemap.xml') as response:urls=re.findall(r'<loc>(.*?)</loc>',response.read().decode())
expected_urls={ORIGIN+page['path'] for page in pages}
baseline=set(subprocess.check_output(['git','show','origin/main:docs/seo/public-urls.txt'],text=True).splitlines())
assert len(urls)==28 and set(urls)==expected_urls==baseline
with urllib.request.urlopen(BASE+'/robots.txt') as response:assert ORIGIN+'/sitemap.xml' in response.read().decode()
evidence=dict(verification_date='2026-10-20',verified_at_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='Fresh local isolated production build; no production or Google account actions',public_pages_checked=len(pages),priority_primary_topic_count=len(phrases),supporting_phrases_checked=sum(map(len,phrases.values())),sitemap_count=len(urls),sitemap_matches_fetched_main=True,robots_sitemap_reference=True,pages=results,failures=failures)
Path('docs/seo/keyword-render-checks.json').write_text(json.dumps(evidence,indent=2)+'\n',encoding='utf-8')
assert not failures,failures
print('PASS: 28 metadata/canonicals/H1s; 18 visible supporting phrases; contextual service/enquiry links; sitemap exactly matches the 28 canonical URLs on fetched main.')
