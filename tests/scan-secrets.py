"""Read-only credential scan. Output file/category/tracking only, never values."""
from pathlib import Path
import json
import re
import subprocess

root = Path(__file__).resolve().parents[1]
tracked = set(subprocess.check_output(["git", "ls-files"], cwd=root, text=True).splitlines())
secret_names = re.compile(r"^(?:OPENAI_API_KEY|MONGODB_URI|NEXTAUTH_SECRET|AUTH_SECRET|GOOGLE_CLIENT_SECRET|GOOGLE_TOKEN_ENCRYPTION_KEY|META_APP_SECRET|META_VERIFY_TOKEN|META_ACCESS_TOKEN|SMTP_PASS|SMTP_PASSWORD|RESEND_API_KEY|EMAIL_CONFIG_ENCRYPTION_KEY|CRON_SECRET)$")
known = {}
for name, raw in re.findall(r"^([A-Z][A-Z0-9_]*)=(.*)$", (root / ".env.local").read_text(encoding="utf-8"), re.M):
    value = raw.strip().strip('"\'').replace(r"\$", "$")
    if secret_names.match(name) and len(value) >= 8:
        known[name] = value
patterns = {"OpenAI key": r"sk-(?:proj-)?[A-Za-z0-9_-]{40,}", "Meta access token": r"EAA[A-Za-z0-9]{60,}", "Resend key": r"re_[A-Za-z0-9_]{25,}", "MongoDB credential": r"mongodb(?:\+srv)?://[^\s/:]+:[^\s@]+@"}
files = set(subprocess.check_output(["git", "ls-files", "-co", "--exclude-standard"], cwd=root, text=True).splitlines())
files.update(str(p.relative_to(root)).replace("\\", "/") for p in root.glob("*.log"))
files.add(".env.local")
files.update(str(p.relative_to(root)).replace("\\", "/") for p in (root / ".next/static").rglob("*.js"))
findings = []
for filename in sorted(files):
    try:
        text = (root / filename).read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        continue
    categories = {name for name, value in known.items() if value in text or value.replace("$", r"\$") in text}
    categories.update(name for name, pattern in patterns.items() if re.search(pattern, text))
    if categories:
        findings.append({"file": filename, "categories": sorted(categories), "tracked": filename in tracked, "action": "Rotate exposed credentials; retain local file ignored" if filename == ".env.local" else "Review and remove credential; rotate at provider"})
report = {"scope": "Tracked and untracked source, root logs, ignored local environment, built browser JavaScript; no Git history rewrite", "findings": findings}
(root / "docs/security-scan.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
