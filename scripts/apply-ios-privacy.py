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
    '<meta name="description" content="TWORK — приложение для тренеров на iPhone. Работает офлайн, хранит клиентскую базу локально и объединяет расписание, абонементы, деньги, клубы, Apple Calendar и сообщения.">',
    html,
    count=1,
)
html = re.sub(
    r'<meta property="og:description" content="[^"]*">',
    '<meta property="og:description" content="Только iOS. Работает офлайн. Клиентская база не загружается на серверы TWORK.">',
    html,
    count=1,
)

css_link = '  <link rel="stylesheet" href="site/platform-privacy.css?v=20260614-1">'
if "site/platform-privacy.css" not in html:
    marker = '  <link rel="stylesheet" href="site/logo-render-fix.css?v=20260614-3">'
    html = html.replace(marker, marker + "\n" + css_link)

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
