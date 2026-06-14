from pathlib import Path
import re

path = Path("index.html")
html = path.read_text()

style_asset = "site/web-app-entry.css"
style_version = "20260614-1"
style_href = f"{style_asset}?v={style_version}"
style_link = f'  <link rel="stylesheet" href="{style_href}">'
if style_asset not in html:
    html = html.replace("</head>", style_link + "\n</head>")
else:
    html = re.sub(rf"{re.escape(style_asset)}\?v=[^\"]+", style_href, html)

script_asset = "site/web-app-entry.js"
script_version = "20260614-1"
script_src = f"{script_asset}?v={script_version}"
script = f'  <script src="{script_src}" defer></script>'
if script_asset not in html:
    html = html.replace("</body>", script + "\n</body>")
else:
    html = re.sub(rf"{re.escape(script_asset)}\?v=[^\"]+", script_src, html)

path.write_text(html)
