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
    ("site/hero-v528-calendar-fix.css", "20260615-4"),
    ("site/hero-v528-client.css", "20260615-3"),
    ("site/hero-v528-scroll.css", "20260615-2"),
]
for asset, version in styles:
    href = f"{asset}?v={version}"
    link = f'  <link rel="stylesheet" href="{href}">'
    if asset in html:
        html = re.sub(rf'{re.escape(asset)}\?v=[^"]+', href, html)
    else:
        html = html.replace("</head>", link + "\n</head>")

scripts = [
    ("site/hero-v528-calendar-fix.js", "20260615-4"),
]
for asset, version in scripts:
    src = f"{asset}?v={version}"
    tag = f'  <script src="{src}" defer></script>'
    if asset in html:
        html = re.sub(rf'{re.escape(asset)}\?v=[^"]+', src, html)
    else:
        html = html.replace("</body>", tag + "\n</body>")

# Remove an older standalone scroll script if a previous build added it.
html = re.sub(
    r'\s*<script src="site/hero-v528-scroll\.js\?v=[^"]+" defer></script>',
    '',
    html,
)

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
