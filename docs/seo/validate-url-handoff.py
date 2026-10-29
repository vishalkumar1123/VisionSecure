"""Validate handoff files offline; does not make network/account requests."""
import ast, csv, json, re
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/seo'
evidence=json.loads((OUT/'url-verification-evidence.json').read_text(encoding='utf-8'))
def normalize(url):
 p=urlsplit(url)
 return (p.scheme,p.netloc,p.path or '/',p.query,p.fragment)
def rows(name):
 with (OUT/name).open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))

expected={normalize(r['canonical']) for r in evidence['pages'] if r['category'].startswith('A:')}
for name in ('verified-public-urls.txt','bing-submit-urls.txt'):
 urls=(OUT/name).read_text(encoding='utf-8').splitlines()
 assert len(urls)==len(set(urls))==len(expected)
 assert {normalize(u) for u in urls}==expected
 for u in urls:
  p=urlsplit(u)
  assert p.scheme=='https' and p.netloc=='visionsecuretech.in' and not p.query and not p.fragment
  assert not re.match(r'^/(?:admin|api|profile|register|inquiry)(?:/|$)',p.path)
assert {normalize(u) for u in evidence['live_sitemap_urls']}==expected
assert {normalize(u) for u in evidence['local_urls']}==expected
audit=rows('url-verification.csv')
assert len(audit)==len(evidence['pages'])+len(evidence['redirect_checks'])+2
assert sum(r['category'].startswith('A:') for r in audit)==len(expected)
keywords=rows('lucknow-keyword-page-map.csv')
assert 100<=len(keywords)<=150
assert len({r['Recommended keyword'].casefold() for r in keywords})==len(keywords)
primary=Counter()
for r in keywords:
 assert normalize(r['Existing target canonical URL']) in expected
 assert r['Intent'] in ('installation','maintenance','comparison','informational','navigation')
 assert r['Primary or supporting keyword'] in ('Primary','Supporting')
 assert r['Verification date']==evidence['verification_date']
 assert 'unmeasured' in r['Research/evidence source']
 assert r['Suggested content placement'].startswith('Proposed:')
 assert r['Relevant internal-link source and destination'].startswith(('Existing:','Proposed:'))
 if r['Primary or supporting keyword']=='Primary':primary[r['Existing target canonical URL']]+=1
assert set(primary)=={r['Existing target canonical URL'] for r in keywords}
assert all(v==1 for v in primary.values())
bots=rows('public-crawler-checks.csv')
assert len(bots)==18 and set(r['User agent'] for r in bots)=={'Googlebot','Bingbot','OAI-SearchBot'}
assert all(r['status']=='200' and r['Robots allowed'].lower()=='true' for r in bots)
for script in ('verify-submission-urls.py','validate-url-handoff.py'):ast.parse((OUT/script).read_text(encoding='utf-8'))
print(f'PASS: {len(expected)} verified canonical URLs; {len(audit)} audit records; {len(keywords)} unique unmeasured keyword recommendations on {len(primary)} existing targets; {len(bots)} declared-bot checks; no private/query URLs in submission lists.')
