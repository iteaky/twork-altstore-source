from pathlib import Path
import re

path = Path("index.html")
html = path.read_text()

styles = {
    "site/theme-cinematic.css": "20260614-1",
    "site/theme-cinematic-patch.css": "20260614-1",
    "site/theme-cinematic-brand.css": "20260614-1",
}
for asset, version in styles.items():
    href = f"{asset}?v={version}"
    link = f'  <link rel="stylesheet" href="{href}">'
    if asset not in html:
        html = html.replace("</head>", link + "\n</head>")
    else:
        html = re.sub(rf"{re.escape(asset)}\?v=[^\"]+", href, html)

script_asset = "site/theme-cinematic.js"
script_version = "20260614-2"
script_src = f"{script_asset}?v={script_version}"
script = f'  <script src="{script_src}" defer></script>'
if script_asset not in html:
    html = html.replace("</body>", script + "\n</body>")
else:
    html = re.sub(rf"{re.escape(script_asset)}\?v=[^\"]+", script_src, html)

path.write_text(html)
