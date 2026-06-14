from pathlib import Path

path = Path("index.html")
html = path.read_text()
html = html.replace("site/theme-liquid.css?v=20260614-1", "site/theme-liquid.css?v=20260614-2")
html = html.replace("site/theme-liquid.js?v=20260614-1", "site/theme-liquid.js?v=20260614-2")
path.write_text(html)
