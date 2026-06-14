from pathlib import Path
import re

path = Path("index.html")
html = path.read_text(encoding="utf-8")

style = r'''<style id="v509-site-fix">
html[data-theme="classic-light"]{--bg:#f7f8fc;--bg2:#eef3fa;--surface:#fff;--surface2:rgba(255,255,255,.80);--text:#141821;--muted:#6e6e73;--line:rgba(0,0,0,.10);--accent:#007aff;--accent2:#6e6e73;--accent3:#8ec7ff;--rgb:0,122,255;--shadow:0 24px 70px rgba(29,45,73,.13);--phone:#f7f8fc;--success:#19a76f;--violet:#7850db;--cal-training:#3478f6;--cal-event:#ffd43b;--cal-duty:#7850db;--cal-selected:#ff4d5e;--cal-today:#ff4d5e;--cal-cell:rgba(0,0,0,.025);--cal-border:rgba(0,0,0,.075);--cal-on-accent:#fff;color-scheme:light}
html[data-theme="classic-dark"]{--bg:#141923;--bg2:#1f2433;--surface:#1b202b;--surface2:rgba(31,36,51,.86);--text:#f7f8fb;--muted:#8e8e93;--line:rgba(255,255,255,.12);--accent:#0a84ff;--accent2:#8e8e93;--accent3:#6bb7ff;--rgb:10,132,255;--shadow:0 28px 80px rgba(0,0,0,.42);--phone:#141923;--success:#30d158;--violet:#bda0ff;--cal-training:#3478f6;--cal-event:#ffd43b;--cal-duty:#bda0ff;--cal-selected:#ff4d5e;--cal-today:#ff4d5e;--cal-cell:rgba(255,255,255,.04);--cal-border:rgba(255,255,255,.09);--cal-on-accent:#fff;color-scheme:dark}
html[data-theme="brand-light"]{--bg:#f64f93;--bg2:#c91b85;--surface:#fff9fc;--surface2:rgba(255,244,250,.90);--text:#2a0f1d;--muted:#84576c;--line:rgba(208,69,132,.25);--accent:#f64f93;--accent2:#d11a80;--accent3:#ffb7d4;--rgb:246,79,147;--shadow:0 26px 76px rgba(117,13,65,.22);--phone:#fff9fc;--success:#18a66b;--violet:#8052eb;--cal-training:#f64f93;--cal-event:#f5ad05;--cal-duty:#8052eb;--cal-selected:#f64f93;--cal-today:#ff404a;--cal-cell:rgba(255,191,224,.22);--cal-border:rgba(229,107,164,.25);--cal-on-accent:#fff;color-scheme:light}
html[data-theme="brand-dark"]{--bg:#063d32;--bg2:#0a8f80;--surface:#10181a;--surface2:rgba(16,31,34,.92);--text:#f2fffb;--muted:#9ac8bf;--line:rgba(94,234,212,.18);--accent:#0abab5;--accent2:#5eead4;--accent3:#8ff7e6;--rgb:10,186,181;--shadow:0 30px 86px rgba(0,0,0,.43);--phone:#10181a;--success:#5eead4;--violet:#d5beff;--cal-training:#5eead4;--cal-event:#5eead4;--cal-duty:#d5beff;--cal-selected:rgba(42,158,144,.86);--cal-today:#0abab5;--cal-cell:rgba(242,255,252,.04);--cal-border:rgba(94,234,212,.10);--cal-on-accent:#071c19;color-scheme:dark}
html[data-theme="brand-light"] .hero-copy .lead,html[data-theme="brand-light"] .hero-copy .eyebrow,html[data-theme="brand-light"] .hero-copy .proof strong,html[data-theme="brand-light"] .hero-copy .proof span,html[data-theme="brand-light"] .hero-copy .link-button{color:#fff}html[data-theme="brand-light"] .hero-copy .proof div{border-color:rgba(255,255,255,.30)}html[data-theme="brand-light"] .hero h1 span{color:#fff}html[data-theme="brand-light"] .hero .button{background:#fff;color:#b41168}
.theme-switch button[data-set="classic-light"]:before{background:linear-gradient(135deg,#f7f8fc 50%,#007aff 50%);border:1px solid rgba(0,0,0,.12)}.theme-switch button[data-set="classic-dark"]:before{background:linear-gradient(135deg,#141923 50%,#0a84ff 50%)}.theme-switch button[data-set="brand-light"]:before{background:linear-gradient(135deg,#f64f93 50%,#c91b85 50%)}.theme-switch button[data-set="brand-dark"]:before{background:linear-gradient(135deg,#063d32 50%,#0abab5 50%)}
.v509-calendar{width:min(100%,390px);margin:25px auto 0;padding:14px 12px 17px;border:1px solid var(--line);border-radius:27px;background:linear-gradient(160deg,var(--bg),var(--surface));box-shadow:0 18px 46px rgba(0,0,0,.08)}.v509-calendar-head{display:flex;align-items:center;justify-content:space-between;padding:2px 5px 12px}.v509-calendar-head button{display:grid;place-items:center;width:30px;height:30px;border:0;border-radius:10px;background:var(--surface2);color:var(--text);font-weight:900}.v509-calendar-head strong{font-size:16px}.v509-weekdays{display:grid;grid-template-columns:repeat(7,1fr);padding-bottom:8px;color:var(--muted);font-size:10px;text-align:center}.v509-grid{position:relative;display:grid;grid-template-columns:repeat(7,1fr);grid-auto-rows:45px;overflow:hidden;border-radius:9px}.v509-cell{position:relative;display:flex;align-items:flex-start;justify-content:center;background:var(--cal-cell);border:.5px solid var(--cal-border);font-size:12px}.v509-cell .v509-num{display:grid;place-items:center;width:100%;height:17px;padding-top:1px;color:var(--text);line-height:1}.v509-cell.out .v509-num{color:var(--muted);opacity:.54}.v509-cell.selected{background:var(--cal-selected)}.v509-cell.selected .v509-num{color:var(--cal-on-accent);font-weight:650}.v509-cell.today:not(.selected){box-shadow:inset 0 0 0 1.5px var(--cal-today)}.v509-count{position:absolute;top:18px;left:50%;z-index:3;display:grid;place-items:center;min-width:15px;height:15px;padding:0 4px;transform:translateX(-50%);border-radius:999px;background:var(--cal-training);color:var(--cal-on-accent);font-size:9px;font-weight:700;line-height:1}.v509-marker{position:absolute;z-index:4;height:3px;border-radius:999px;pointer-events:none}.v509-marker.duty{background:var(--cal-duty)}.v509-marker.event{background:var(--cal-event)}.v509-marker.single{width:28px}.v509-legend{display:flex;justify-content:center;gap:16px;margin-top:14px;color:var(--muted);font-size:10px}.v509-legend span{display:flex;align-items:center;gap:5px}.v509-legend i{display:block;width:18px;height:3px;border-radius:99px}.v509-legend .training i{width:15px;height:15px;border-radius:50%;background:var(--cal-training)}.v509-legend .duty i{background:var(--cal-duty)}.v509-legend .event i{background:var(--cal-event)}
@media(max-width:640px){.v509-calendar{padding:13px 7px 16px;border-radius:23px}.v509-legend{gap:10px;font-size:9px}}
</style>'''

script = r'''<script id="v509-site-fix-script">
(function(){
  const allowed=['classic-light','classic-dark','brand-light','brand-dark'];
  const legacy={rose:'brand-light',tiffany:'brand-dark',classic:'classic-light'};
  let selected=localStorage.getItem('twork-theme')||'brand-light';
  selected=legacy[selected]||selected;
  if(!allowed.includes(selected)) selected='brand-light';
  localStorage.setItem('twork-theme',selected);
  document.documentElement.dataset.theme=selected;
  document.querySelectorAll('[data-set]').forEach(button=>button.classList.toggle('active',button.dataset.set===selected));

  const host=document.getElementById('calendar');
  if(!host) return;
  host.innerHTML='<div class="v509-calendar"><div class="v509-calendar-head"><button aria-label="Предыдущий месяц">‹</button><strong>Июнь 2026</strong><button aria-label="Следующий месяц">›</button></div><div class="v509-weekdays"><span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span></div><div class="v509-grid"></div><div class="v509-legend"><span class="training"><i></i>Тренировки</span><span class="duty"><i></i>Дежурство</span><span class="event"><i></i>Событие</span></div></div>';
  const grid=host.querySelector('.v509-grid');
  const counts={1:2,3:1,5:3,8:2,10:4,12:1,14:4,16:2,18:3,20:1,23:2,25:5,27:2,29:1};
  const days=[];
  for(let day=1;day<=30;day++) days.push({day,current:true});
  for(let day=1;day<=5;day++) days.push({day,current:false});
  days.forEach(item=>{
    const cell=document.createElement('div');
    cell.className='v509-cell'+(item.current?'':' out')+(item.current&&item.day===14?' selected':'');
    cell.innerHTML='<span class="v509-num">'+item.day+'</span>'+(item.current&&counts[item.day]?'<span class="v509-count">'+counts[item.day]+'</span>':'');
    grid.appendChild(cell);
  });
  const rowHeight=45,badgeBottom=34,lineHeight=3,equalGap=(rowHeight-badgeBottom-lineHeight*2)/3,dutyY=badgeBottom+equalGap,eventY=dutyY+lineHeight+equalGap;
  function marker(type,row,start,end){
    const line=document.createElement('span');
    const single=start===end;
    line.className='v509-marker '+type+(single?' single':'');
    line.style.top=(row*rowHeight+(type==='duty'?dutyY:eventY))+'px';
    line.style.left='calc('+(((start+.5)/7)*100)+'% - 14px)';
    if(!single) line.style.width='calc('+(((end-start)/7)*100)+'% + 28px)';
    grid.appendChild(line);
  }
  marker('duty',0,1,1); marker('event',0,3,5);
  marker('duty',1,0,2); marker('event',1,4,4);
  marker('event',2,1,3); marker('duty',2,5,6);
  marker('duty',3,2,2); marker('event',3,4,6);
  marker('event',4,0,1);
})();
</script>'''

html = re.sub(r'\n?<style id="v509-site-fix">.*?</style>', '', html, flags=re.S)
html = re.sub(r'\n?<script id="v509-site-fix-script">.*?</script>', '', html, flags=re.S)

theme_switch = '<div class="theme-switch" aria-label="Цветовая схема"><button data-set="classic-light" title="Classic Light" aria-label="Classic Light"></button><button data-set="classic-dark" title="Classic Dark" aria-label="Classic Dark"></button><button data-set="brand-light" title="Brand Light" aria-label="Brand Light"></button><button data-set="brand-dark" title="Brand Dark" aria-label="Brand Dark"></button></div>'
html, count = re.subn(r'<div class="theme-switch"[^>]*>.*?</div>', theme_switch, html, count=1, flags=re.S)
if count != 1:
    raise RuntimeError("Theme switch was not found")

html = html.replace('</head>', style + '\n</head>', 1)
html = html.replace('</body>', script + '\n</body>', 1)
path.write_text(html, encoding="utf-8")
