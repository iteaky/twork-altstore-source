from pathlib import Path
import re

index_path = Path("index.html")
fragment_path = Path("site/hero-v528-fragment.html")
html = index_path.read_text()
fragment = fragment_path.read_text().strip()

# Replace the whole hero mockup area up to the manifesto section. This is
# intentionally broader than matching a nested closing </div>, because a
# previous patch left duplicated client-dashboard cards outside the phones.
pattern = re.compile(
    r'<div class="container product-theater reveal" id="product" aria-label="Демонстрация TWORK">.*?(?=\s*<section class="manifesto section-pad">)',
    re.S,
)
replacement = fragment + "\n    </section>\n\n    "
html, count = pattern.subn(replacement, html, count=1)
if count != 1:
    raise SystemExit("Hero product theater area was not found exactly once")

styles = [
    ("site/hero-v528-home.css", "20260615-1"),
    ("site/hero-v528-calendar.css", "20260615-1"),
    ("site/hero-v528-calendar-fix.css", "20260615-2"),
    ("site/hero-v528-client.css", "20260615-1"),
]
for asset, version in styles:
    href = f"{asset}?v={version}"
    link = f'  <link rel="stylesheet" href="{href}">'
    if asset in html:
        html = re.sub(rf'{re.escape(asset)}\?v=[^"]+', href, html)
    else:
        html = html.replace("</head>", link + "\n</head>")

script_asset = "site/hero-v528-calendar-fix.js"
script_version = "20260615-2"
script_src = f"{script_asset}?v={script_version}"
script_tag = f'  <script src="{script_src}" defer></script>'
if script_asset in html:
    html = re.sub(rf'{re.escape(script_asset)}\?v=[^"]+', script_src, html)
else:
    html = html.replace("</body>", script_tag + "\n</body>")

# Release guard: these hero structures must exist exactly once in the HTML.
checks = {
    'id="product"': 1,
    'class="hero-client-grid"': 1,
    'class="hero-calendar-screen"': 1,
    'class="real-home-preview"': 1,
}
for marker, expected in checks.items():
    actual = html.count(marker)
    if actual != expected:
        raise SystemExit(f"Unexpected count for {marker}: {actual}, expected {expected}")

index_path.write_text(html)
