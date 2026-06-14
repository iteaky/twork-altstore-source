from pathlib import Path
import re

path = Path("index.html")
html = path.read_text(encoding="utf-8")

style_link = '<link id="feature-atlas-style" rel="stylesheet" href="site/feature-atlas.css?v=v509-full">'
section = r'''<section id="all-features" class="section shell feature-atlas">
  <div class="heading reveal">
    <div class="kicker">Полная карта продукта</div>
    <h2>Весь TWORK — <span class="gradient-text">без скрытых функций.</span></h2>
    <p>Каталог составлен по актуальной сборке v509. Здесь описаны рабочие сценарии тренера: от первого клиента и расписания до клубных расчётов, автоматических сообщений и восстановления данных.</p>
    <span class="atlas-version">Актуально для v509</span>
  </div>
  <div class="atlas-stats reveal">
    <div><strong>14</strong><span>функциональных модулей</span></div>
    <div><strong>228</strong><span>конкретных возможностей</span></div>
    <div><strong>4</strong><span>цветовые схемы</span></div>
    <div><strong>5</strong><span>способов отправки</span></div>
  </div>
  <div class="atlas-toolbar reveal">
    <label class="atlas-search"><span>⌕</span><input id="feature-search" type="search" autocomplete="off" placeholder="Найти функцию: абонемент, клуб, возврат, календарь…"><kbd id="feature-result-count">228</kbd></label>
    <div class="atlas-filters" role="group" aria-label="Фильтр функций">
      <button type="button" data-atlas-filter="all" class="active">Все</button>
      <button type="button" data-atlas-filter="work">Клиенты и продукты</button>
      <button type="button" data-atlas-filter="schedule">Расписание</button>
      <button type="button" data-atlas-filter="money">Деньги</button>
      <button type="button" data-atlas-filter="automation">Автоматизация</button>
      <button type="button" data-atlas-filter="system">Настройки и данные</button>
    </div>
    <button class="atlas-expand" id="atlas-expand" type="button">Развернуть все</button>
  </div>
  <div class="atlas-grid" id="atlas-grid"><div class="atlas-loading">Загружаем полный каталог функций…</div></div>
  <div class="atlas-empty" id="atlas-empty" hidden>По этому запросу ничего не найдено. Попробуйте другое слово.</div>
  <div class="atlas-footer reveal">
    <div><strong>Не нашли нужный сценарий?</strong><span>Опишите его в заявке на ранний доступ — это поможет расставить приоритеты разработки.</span></div>
    <button class="button js-early-access" type="button">Запросить ранний доступ →</button>
  </div>
</section>'''
script = '<script id="feature-atlas-script" src="site/feature-atlas.js?v=v509-full" defer></script>'
nav = '<nav class="nav"><a href="#features">Обзор</a><a href="#product">Интерфейс</a><a href="#all-features">Все функции</a><a href="#clubs">Клубы</a></nav>'

html = re.sub(r'\n?<link id="feature-atlas-style"[^>]*>', '', html)
html = re.sub(r'\n?<section id="all-features".*?</section>', '', html, flags=re.S)
html = re.sub(r'\n?<script id="feature-atlas-script".*?</script>', '', html, flags=re.S)
html, nav_count = re.subn(r'<nav class="nav">.*?</nav>', nav, html, count=1, flags=re.S)
if nav_count != 1:
    raise RuntimeError("Main navigation was not found")
html = html.replace('</head>', style_link + '\n</head>', 1)
club_marker = '<section id="clubs"'
if club_marker not in html:
    raise RuntimeError("Clubs section was not found")
html = html.replace(club_marker, section + '\n' + club_marker, 1)
html = html.replace('</body>', script + '\n</body>', 1)
path.write_text(html, encoding="utf-8")
