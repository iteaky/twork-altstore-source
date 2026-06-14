from pathlib import Path
import re

path = Path("index.html")
html = path.read_text()

html = re.sub(
    r'\s*<link rel="stylesheet" href="site/web-app-entry\.css\?v=[^"]+">',
    "",
    html,
)
html = re.sub(
    r'\s*<script src="site/web-app-entry\.js\?v=[^"]+" defer></script>',
    "",
    html,
)

path.write_text(html)
