from pathlib import Path
import re

path = Path("index.html")
html = path.read_text(encoding="utf-8")

style = r'''<style id="early-access-style">
.early-access-backdrop{position:fixed;z-index:100;inset:0;display:grid;place-items:center;padding:18px;background:rgba(5,8,12,.66);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease}.early-access-backdrop.open{opacity:1;visibility:visible}.early-access-modal{position:relative;width:min(100%,520px);max-height:min(90vh,760px);overflow:auto;padding:30px;border:1px solid var(--line);border-radius:30px;background:var(--surface);box-shadow:0 35px 110px rgba(0,0,0,.40);transform:translateY(16px) scale(.98);transition:transform .2s ease}.early-access-backdrop.open .early-access-modal{transform:none}.early-access-close{position:absolute;top:16px;right:16px;display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--line);border-radius:13px;background:var(--bg);color:var(--text);font-size:22px;cursor:pointer}.early-access-kicker{color:var(--accent);font-size:11px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.early-access-modal h2{max-width:400px;margin:12px 0 10px;font-size:36px;letter-spacing:-.045em;line-height:1.02}.early-access-intro{margin:0 0 24px;color:var(--muted);font-size:14px;line-height:1.55}.early-access-form{display:grid;gap:15px}.early-access-form label{display:grid;gap:7px;color:var(--text);font-size:12px;font-weight:800}.early-access-form input,.early-access-form select,.early-access-form textarea{width:100%;min-height:50px;padding:13px 14px;border:1px solid var(--line);border-radius:15px;outline:none;background:var(--bg);color:var(--text);font:inherit}.early-access-form textarea{min-height:102px;resize:vertical}.early-access-form input:focus,.early-access-form select:focus,.early-access-form textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(var(--rgb),.12)}.early-access-form .button{width:100%;margin-top:4px}.early-access-note{margin:2px 4px 0;color:var(--muted);font-size:10px;line-height:1.45;text-align:center}.early-access-success{position:fixed;z-index:110;right:20px;bottom:20px;max-width:360px;padding:17px 19px;border:1px solid var(--line);border-radius:18px;background:var(--surface);box-shadow:var(--shadow);color:var(--text);font-size:13px;line-height:1.45;transform:translateY(24px);opacity:0;pointer-events:none;transition:.25s ease}.early-access-success.show{transform:none;opacity:1}.js-early-access{appearance:none}.story-copy .js-early-access{margin-top:12px}body.modal-open{overflow:hidden}
@media(max-width:640px){.early-access-modal{padding:26px 18px 20px;border-radius:24px}.early-access-modal h2{font-size:31px}.early-access-backdrop{align-items:end;padding:8px}.early-access-modal{width:100%;max-height:94vh;border-bottom-left-radius:18px;border-bottom-right-radius:18px}}
</style>'''

modal = r'''<div class="early-access-backdrop" id="early-access-modal" role="dialog" aria-modal="true" aria-labelledby="early-access-title" aria-hidden="true">
  <div class="early-access-modal">
    <button class="early-access-close" type="button" aria-label="Закрыть форму">×</button>
    <div class="early-access-kicker">TWORK Early Access</div>
    <h2 id="early-access-title">Запросить ранний доступ</h2>
    <p class="early-access-intro">Расскажите немного о себе. Мы свяжемся с вами, когда сможем подключить вас к ранней версии TWORK.</p>
    <form class="early-access-form" action="https://formsubmit.co/twork.crm@gmail.com" method="POST">
      <input type="hidden" name="_subject" value="Новая заявка на ранний доступ TWORK">
      <input type="hidden" name="_next" value="https://iteaky.github.io/twork-altstore-source/?access=sent">
      <input type="hidden" name="_template" value="table">
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <label>Имя<input type="text" name="Имя" autocomplete="name" required placeholder="Как к вам обращаться"></label>
      <label>Email<input type="email" name="email" autocomplete="email" required placeholder="name@example.com"></label>
      <label>Кто вы?
        <select name="Тип пользователя" required>
          <option value="" selected disabled>Выберите вариант</option>
          <option>Персональный тренер</option>
          <option>Тренер в нескольких клубах</option>
          <option>Владелец студии или клуба</option>
          <option>Другое</option>
        </select>
      </label>
      <label>Telegram или Instagram <input type="text" name="Дополнительный контакт" placeholder="Необязательно"></label>
      <label>Что важно для вас в TWORK?<textarea name="Комментарий" placeholder="Необязательно"></textarea></label>
      <button class="button" type="submit">Отправить заявку →</button>
      <p class="early-access-note">Отправляя форму, вы соглашаетесь, что мы используем указанные данные только для связи по поводу раннего доступа.</p>
    </form>
  </div>
</div>
<div class="early-access-success" id="early-access-success" role="status">Заявка отправлена. Мы напишем вам на указанный email.</div>'''

script = r'''<script id="early-access-script">
(function(){
  const modal=document.getElementById('early-access-modal');
  if(!modal) return;
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')};
  const open=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>modal.querySelector('input[name="Имя"]')?.focus(),120)};
  document.querySelectorAll('.js-early-access').forEach(button=>button.addEventListener('click',open));
  modal.querySelector('.early-access-close')?.addEventListener('click',close);
  modal.addEventListener('click',event=>{if(event.target===modal) close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal.classList.contains('open')) close()});
  const params=new URLSearchParams(location.search);
  if(params.get('access')==='sent'){
    const success=document.getElementById('early-access-success');
    success?.classList.add('show');
    history.replaceState({},'',location.pathname+location.hash);
    setTimeout(()=>success?.classList.remove('show'),6000);
  }
})();
</script>'''

html = re.sub(r'\n?<style id="early-access-style">.*?</style>', '', html, flags=re.S)
html = re.sub(r'\n?<div class="early-access-backdrop".*?<div class="early-access-success".*?</div>', '', html, flags=re.S)
html = re.sub(r'\n?<script id="early-access-script">.*?</script>', '', html, flags=re.S)

# Replace every visible outbound GitHub CTA with the early-access form trigger.
html = re.sub(
    r'<a class="button" href="https://github\.com/iteaky/twork-altstore-source">.*?</a>',
    '<button class="button js-early-access" type="button">Запросить ранний доступ →</button>',
    html,
    flags=re.S,
)
html = html.replace(
    '<a class="cta-small" href="#final">Попробовать</a>',
    '<button class="cta-small js-early-access" type="button">Ранний доступ</button>',
)
html = html.replace(
    '<a class="button" href="#final">Посмотреть возможности →</a>',
    '<button class="button js-early-access" type="button">Запросить ранний доступ →</button>',
)

html = html.replace('</head>', style + '\n</head>', 1)
html = html.replace('</body>', modal + '\n' + script + '\n</body>', 1)
path.write_text(html, encoding="utf-8")
