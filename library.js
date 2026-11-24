// مكتبة Grammar حسب السنة الدراسية. البيانات في data/grammar-library.json (كل سنة كائن مستقل).
// لإضافة سنة: أضف كائنًا في "years" وضع مفتاحه في "order". لإضافة قاعدة: أضفها في rules السنة المعنية فقط.
// حقول اختيارية للقاعدة: ar (اسم عربي), summary, form (قائمة), examples ([[en, ar], ...]).
const Gram=(()=>{
  const KEY='gramYear';
  let lib=null,cur=null;
  const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const body=()=>document.querySelector('#gram-body');

  async function load(){
    if(lib)return lib;
    const r=await fetch('data/grammar-library.json');
    if(!r.ok)throw new Error('load failed');
    const j=await r.json();
    if(!j||typeof j.years!=='object'||!j.tracks)throw new Error('bad shape');
    lib=j;return lib;
  }
  function yearIds(l){
    const o=(l.order||[]).filter(id=>l.years[id]);
    Object.keys(l.years).forEach(id=>{if(!o.includes(id))o.push(id)});
    return o;
  }
  function filterRules(y,q){
    const n=t=>String(t||'').toLowerCase().replace(/[\u064B-\u0652]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').trim();
    const s=n(q);
    return s?y.rules.filter(r=>n(r.name).includes(s)||n(r.ar).includes(s)):y.rules;
  }
  async function savedYear(l){
    try{const v=await DB.setting(KEY);return v&&l.years[v]?v:''}catch(e){return ''}
  }
  function ruleList(list){
    return list.length?list.map(r=>`<button class="item" data-gr="${E(r.id)}"><b dir="ltr">${E(r.name)}</b><span>${r.ar?E(r.ar):''}</span></button>`).join('')
      :'<p class="empty">لا توجد قاعدة بهذا الاسم في هذه السنة.</p>';
  }
  function fail(){body().innerHTML='<p class="err">تعذر تحميل مكتبة القواعد. افتح التطبيق مرة واحدة مع الإنترنت ثم أعد المحاولة.</p>'}

  // قائمة السنوات (التنقل اليدوي)
  async function years(){
    let l;try{l=await load()}catch(e){return fail()}
    cur=null;const def=await savedYear(l);let h='<p class="empty" style="padding:0 0 12px">اختر سنتك الدراسية. كل سنة لها قواعدها فقط.</p>';
    for(const t of Object.keys(l.tracks)){
      const ids=yearIds(l).filter(id=>l.years[id].track===t);if(!ids.length)continue;
      h+=`<h3>${E(l.tracks[t])}</h3>`+ids.map(id=>{const y=l.years[id];
        return `<button class="item${y.verified?'':' off'}" data-gy="${E(id)}"><b>${E(y.name)}</b><span>${def===id?'<em class="star">★ سنتي</em>':''}</span><i>${y.rules.length?y.rules.length+' قاعدة'+(y.verified?'':' · راجعها'):'غير مكتمل التحقق'}</i></button>`}).join('');
    }
    body().innerHTML=h;window.scrollTo(0,0);
  }

  // قواعد سنة واحدة
  async function openYear(id){
    let l;try{l=await load()}catch(e){return fail()}
    const y=l.years[id];if(!y)return years();
    cur=id;const def=await savedYear(l);
    const has=y.rules.length>0;
    body().innerHTML=`<div class="btns" style="margin:0 0 12px"><button class="btn ghost" data-gact="years">← تغيير السنة</button></div>
      <h2 class="vt">${E(y.name)}</h2>`+(has&&y.note?`<p class="note">${E(y.note)}</p>`:'')+
      (has?`<label class="search"><span aria-hidden="true">🔍</span><input id="gram-q" type="search" placeholder="ابحث في قواعد هذه السنة" dir="auto" autocomplete="off"></label><div id="gram-list">${ruleList(y.rules)}</div>`
          :'<p class="empty">قواعد هذه السنة غير مكتملة التحقق من فهرس المعاصر، فلم تُضف بعد. عند تأكيد الفهرس تظهر هنا فقط.</p>')+
      `<button class="btn ${def===id?'primary':'ghost'}" data-gact="default" style="width:100%;margin-top:14px">${def===id?'✓ هذه سنتي (تُفتح تلقائيًا)':'اجعلها سنتي وافتحها تلقائيًا'}</button>`;
    window.scrollTo(0,0);
  }

  // قاعدة واحدة
  async function openRule(yid,rid){
    let l;try{l=await load()}catch(e){return fail()}
    const y=l.years[yid];const r=y&&y.rules.find(x=>x.id===rid);if(!r)return years();
    const ul=a=>'<ul>'+a.map(x=>`<li dir="auto">${E(x)}</li>`).join('')+'</ul>';
    body().innerHTML=`<div class="btns" style="margin:0 0 12px"><button class="btn ghost" data-gact="year">← قواعد ${E(y.name)}</button></div>
      <article class="card"><h2 class="en" dir="ltr">${E(r.name)}</h2><p class="rule-sub">${E(y.name)}${r.ar?' · '+E(r.ar):''}</p>`+
      (r.summary?`<p dir="auto">${E(r.summary)}</p>`:'')+
      (r.form&&r.form.length?`<h3>التكوين</h3>${ul(r.form)}`:'')+
      (r.examples&&r.examples.length?`<h3>أمثلة</h3>`+r.examples.map(e=>`<p class="ex" dir="ltr">${E(e[0])}<br><span dir="rtl">${E(e[1])}</span></p>`).join(''):'')+
      (r.summary||r.form||r.examples?'':'<p class="empty">الاسم من فهرس المعاصر. الشرح لم يُضف بعد لهذه القاعدة.</p>')+
      (r.lesson&&typeof LESSONS!=='undefined'&&LESSONS.some(x=>x.id===r.lesson)?`<div class="btns"><button class="btn primary" data-gex="${E(r.lesson)}">تدرّب على هذه القاعدة</button></div>`:'')+
      `</article>`;
    window.scrollTo(0,0);
  }

  // عند فتح تبويب القواعد: السنة المحفوظة مباشرة، وإلا قائمة السنوات
  async function home(){
    let l;try{l=await load()}catch(e){return fail()}
    const def=await savedYear(l);return def?openYear(def):years();
  }

  document.addEventListener('click',async e=>{
    const y=e.target.closest('[data-gy]');if(y)return openYear(y.dataset.gy);
    const r=e.target.closest('[data-gr]');if(r&&cur)return openRule(cur,r.dataset.gr);
    const a=e.target.closest('[data-gact]');if(!a)return;
    const k=a.dataset.gact;
    if(k==='years')return years();
    if(k==='year')return openYear(cur);
    if(k==='default'&&cur){
      const same=(await savedYear(lib))===cur;
      try{await DB.setting(KEY,same?'':cur)}catch(err){}
      return openYear(cur);
    }
  });
  document.addEventListener('input',e=>{
    if(e.target.id!=='gram-q'||!lib||!cur)return;
    const y=lib.years[cur];document.querySelector('#gram-list').innerHTML=ruleList(filterRules(y,e.target.value));
  });

  return{home,years,openYear,openRule,filterRules,yearIds};
})();
