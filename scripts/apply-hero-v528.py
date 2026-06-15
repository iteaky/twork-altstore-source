from pathlib import Path
import re

index_path = Path("index.html")
fragment_path = Path("site/hero-v528-fragment.html")
html = index_path.read_text()
fragment = fragment_path.read_text().strip()

pattern = re.compile(
    r'<div class="container product-theater reveal" id="product" aria-label="Демонстрация TWORK">.*?</div>\s*</section>',
    re.S,
)
replacement = fragment + "\n    </section>"
html, count = pattern.subn(replacement, html, count=1)
if count != 1:
    raise SystemExit("Hero product theater block was not found exactly once")

styles = [
    ("site/hero-v528-home.css", "20260615-1"),
    ("site/hero-v528-calendar.css", "20260615-1"),
    ("site/hero-v528-client.css", "20260615-1"),
]
for asset, version in styles:
    href = f"{asset}?v={version}"
    link = f'  <link rel="stylesheet" href="{href}">'
    if asset in html:
        html = re.sub(rf'{re.escape(asset)}\?v=[^"]+', href, html)
    else:
        html = html.replace("</head>", link + "\n</head>")

index_path.write_text(html)
