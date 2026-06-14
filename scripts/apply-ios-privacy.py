from pathlib import Path
import re

path = Path("index.html")
html = path.read_text()

html = html.replace(
    "<title>TWORK — система для персональных и онлайн-тренеров</title>",
    "<title>TWORK — система для тренеров на iPhone</title>",
)
html = re.sub(
    r'<meta name="description" content="[^"]*">',
    '<meta name="description" content="TWORK — приложение для тренеров на iPhone. Работает офлайн, хранит данные локально и создаёт отдельные клиентские календари с расписанием, остатком абонемента, долгом и комментариями тренера.">',
    html,
    count=1,
)
html = re.sub(
    r'<meta property="og:description" content="[^"]*">',
    '<meta property="og:description" content="Клиент видит своё расписание, остаток абонемента и комментарии тренера прямо в Apple Calendar — без отдельного личного кабинета.">',
    html,
    count=1,
)

styles = {
    "site/platform-privacy.css": "20260614-4",
    "site/mobile-polish.css": "20260614-1",
    "site/mobile-final.css": "20260614-1",
}
for asset, version in styles.items():
    href = f'{asset}?v={version}'
    link = f'  <link rel="stylesheet" href="{href}">'
    if asset not in html:
        html = html.replace('</head>', link + '\n</head>')
    else:
        html = re.sub(rf'{re.escape(asset)}\?v=[^"]+', href, html)

html = re.sub(
    r'site/premium\.js\?v=[^"]+',
    'site/premium.js?v=20260614-8',
    html,
)

shape_script = '  <script src="site/global-icon-shape-fix.js?v=20260614-2" defer></script>'
if 'site/global-icon-shape-fix.js' not in html:
    html = html.replace('</body>', shape_script + '\n</body>')
else:
    html = re.sub(
        r'site/global-icon-shape-fix\.js\?v=[^"]+',
        'site/global-icon-shape-fix.js?v=20260614-2',
        html,
    )

# Calendar content and CTA are now static HTML, preventing mobile layout shifts.
html = re.sub(
    r'\s*<script src="site/mobile-polish\.js\?v=[^"]+" defer></script>',
    '',
    html,
)

calendar_article = '''        <article class="essential-panel reveal" id="calendar-sync" data-client-insight-ready="true">
          <div class="essential-copy">
            <span class="essential-number">03</span>
            <h3>Календарь клиента — не только расписание.</h3>
            <p>Для каждого клиента создаётся отдельный календарь только с его тренировками. В комментарии к событию TWORK показывает актуальную информацию, которую клиент обычно ищет в личном кабинете.</p>
            <div class="essential-points">
              <span>Номер занятия в абонементе: например, 7 из 8</span>
              <span>Предупреждение, когда после тренировки останется 1 или 0 занятий</span>
              <span>Сумма долга, постоянная информация и комментарий тренера</span>
              <span>Текст на языке клиента и синхронизация при переносе или отмене</span>
            </div>
            <div class="client-calendar-benefit">
              <strong>Клиенту не нужен отдельный личный кабинет</strong>
              <span>Он открывает привычное событие в Apple Calendar и видит время, остаток абонемента, предупреждения и ваши инструкции.</span>
            </div>
          </div>
          <div class="essential-visual calendar-share" aria-hidden="true">
            <div class="calendar-card">
              <div class="calendar-card-head"><b>Моё полное расписание</b><small>Apple Calendar</small></div>
              <span class="share-badge">Доступ для семьи</span>
              <div class="week-mini"><span>Пн</span><span class="busy">Вт</span><span class="busy">Ср</span><span>Чт</span><span class="busy">Пт</span></div>
              <div class="calendar-list"><div><b>10:00 · Онлайн</b><small>Mark · London</small></div><div class="duty"><b>15:00 · Дежурство</b><small>Iron Club</small></div><div class="event"><b>20:00 · Личное событие</b><small>Весь день виден полностью</small></div></div>
            </div>
            <div class="calendar-card personal client-event-card">
              <div class="calendar-card-head"><b>Календарь Анны</b><small>Только её занятия</small></div>
              <span class="share-badge">Apple Calendar · только просмотр</span>
              <div class="client-event-summary"><time>18 июня · 18:00</time><b>Тренировка с Константином</b><small>Iron Club · 60 минут</small></div>
              <div class="client-event-comment">
                <div class="client-note-line">Абонемент: 7 из 8.</div>
                <div class="client-note-line warning">После этой тренировки останется: 1.</div>
                <div class="client-note-line debt">Долг: €35.</div>
                <div class="client-note-line">Свяжитесь с тренером, если нужно перенести тренировку.</div>
                <div class="client-note-separator"></div>
                <div class="client-note-extra"><strong>Комментарий тренера</strong>Возьмите полотенце.</div>
              </div>
              <div class="client-event-meta"><span>Язык клиента</span><span>Авто + свой текст</span><span>Обновляется вместе с событием</span></div>
            </div>
          </div>
          <div class="mobile-calendar-cta">
            <strong>Клиент видит остаток тренировок прямо в календаре</strong>
            <p>Покажите расписание, долг и комментарии без отдельного личного кабинета.</p>
            <button class="js-access" type="button">Запросить ранний доступ</button>
          </div>
        </article>'''
html = re.sub(
    r'        <article class="essential-panel reveal" id="calendar-sync".*?</article>',
    calendar_article,
    html,
    count=1,
    flags=re.S,
)

trust = '<div class="platform-trust" aria-label="Платформа и приватность"><span class="platform-ios">Только iOS</span><span class="platform-offline">Работает офлайн</span><span class="platform-local">Без сервера TWORK</span></div>'
if 'class="platform-trust"' not in html:
    hero_actions = '<div class="hero-actions"><button class="primary-button js-access" type="button">Запросить ранний доступ</button><a class="text-link" href="#essentials">Увидеть возможности <span>↓</span></a></div>'
    html = html.replace(hero_actions, hero_actions + trust)

privacy = '''
    <section class="privacy-section section-pad" id="privacy">
      <div class="container privacy-layout">
        <div class="privacy-copy reveal">
          <p class="overline">Приватность по умолчанию</p>
          <h2>Ваши клиенты.<br>На вашем iPhone.</h2>
          <p>TWORK работает без подключения к интернету. Данные клиентов, тренировок, абонементов и оплат хранятся локально на устройстве и не загружаются в серверную базу TWORK.</p>
          <p class="privacy-apple-note"><strong>Сервисы Apple — только по вашему выбору.</strong> При включённых резервных копиях iCloud или синхронизации Apple Calendar данные обрабатываются сервисами Apple в соответствии с настройками вашего устройства.</p>
        </div>
        <div class="privacy-cards reveal">
          <article class="privacy-card"><span class="privacy-icon" aria-hidden="true">✓</span><small>Офлайн</small><h3>Основная работа без интернета</h3><p>Расписание, клиенты, абонементы, оплаты и расчёты доступны прямо на телефоне — даже без подключения к сети.</p></article>
          <article class="privacy-card"><span class="privacy-icon" aria-hidden="true">×</span><small>Локальные данные</small><h3>Нет серверной базы TWORK</h3><p>У TWORK нет собственного сервера, на который загружается ваша клиентская база.</p></article>
          <article class="privacy-card"><span class="privacy-icon privacy-icon-ios" aria-hidden="true">iOS</span><small>Платформа</small><h3>Создано только для iPhone</h3><p>Первая версия TWORK будет доступна только на iOS и глубоко интегрирована с возможностями Apple.</p></article>
        </div>
      </div>
    </section>
'''
if 'id="privacy"' not in html:
    html = html.replace('    <section class="final-section section-pad">', privacy + '\n    <section class="final-section section-pad">')

html = html.replace(
    '<p>Система для персональных и онлайн-тренеров · 2026</p>',
    '<p>Только iOS · Работает офлайн · 2026</p>',
)

path.write_text(html)
