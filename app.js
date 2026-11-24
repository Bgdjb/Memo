const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null,activeView='';

function card(x,fav){
  const ex=Array.isArray(x.ex)?x.ex:[],syn=x.syn||[],ant=x.ant||[];
  return `<article class="card" data-en="${esc(x.en)}">
   <h2 class="en" dir="ltr">${esc(x.en)} <span class="lvl">${esc(x.level)}</span></h2>
   <p class="ipa" dir="ltr">${esc(x.ipa)}</p>
   <p class="pron">النطق بالعربي: ${esc(x.pron)}</p>
   <div class="row"><span class="pos" dir="ltr">${esc(x.pos)}</span><span class="ar">${esc(x.ar)}</span></div>
   <p class="def" dir="ltr">${esc(x.def)}</p>
   ${ex.map(e=>`<p class="ex" dir="ltr">${esc(e[0])}<br><span dir="rtl">${esc(e[1])}</span></p>`).join('')}
   ${syn.length?`<p class="tags">مرادفات: <span dir="ltr">${syn.map(esc).join('، ')}</span></p>`:''}
   ${ant.length?`<p class="tags">متضادات: <span dir="ltr">${ant.map(esc).join('، ')}</span></p>`:''}
   <div class="btns"><button class="btn primary" data-act="speak">استمع</button>
   <button class="btn ghost" data-act="fav">${fav?'محفوظة ✓':'حفظ'}</button></div></article>`;
}
async function show(x,target,log=true){
  if(!x){target.innerHTML='<p class="empty">الكلمة غير موجودة.</p>';return}
  current=x;target.innerHTML=card(x,await Dict.isFav(x.en));
  if(log)Dict.logView(x);
}
function renderList(list,target,empty){
  target.innerHTML=list.length?list.map(x=>`<button class="item" data-en="${esc(x.en)}"><b dir="ltr">${esc(x.en)}</b><span>${esc(x.ar)}</span><i dir="ltr">${esc(x.level)}</i></button>`).join(''):`<p class="empty">${empty}</p>`;
}
async function safe(fn,target,msg){
  try{return await fn()}catch(err){console.error(err);if(target)target.innerHTML=`<p class="err">${msg||'حدث خطأ غير متوقع. أعد المحاولة.'}</p>`}
}
const views={
  async home(){
    const t=$('#home-card');
    await safe(async()=>{const x=await Dict.wordOfDay();if(!x){t.innerHTML='';return}current=x;t.innerHTML=card(x,await Dict.isFav(x.en))},t);
  },
  async favs(){const t=$('#favs-list');await safe(async()=>renderList(await Dict.favorites(),t,'لا توجد كلمات محفوظة. افتح كلمة واضغط «حفظ».'),t)},
  async hist(){const t=$('#hist-list');await safe(async()=>renderList(await Dict.history(),t,'لم تبحث عن كلمات بعد. ابدأ من الرئيسية.'),t)},
  async more(){
    const t=$('#stats');
    await safe(async()=>{
      const [n,f,h,at]=await Promise.all([DB.count('words'),DB.count('favorites'),DB.count('history'),DB.all('attempts')]);
      const ok=at.filter(a=>a.ok).length,pct=at.length?Math.round(100*ok/at.length):null;
      t.innerHTML=`<div class="stat-grid">
        <div class="stat"><b>${n}</b><span>كلمة في القاموس</span></div>
        <div class="stat"><b>${f}</b><span>كلمة محفوظة</span></div>
        <div class="stat"><b>${h}</b><span>عملية بحث</span></div>
        <div class="stat"><b>${pct===null?'—':pct+'%'}</b><span>دقة التدريبات</span></div></div>`;
    },t);
  },
  gram:()=>Gram.home(),
  ex:()=>Ex.home()
};
const VIEW_NAMES=['home','gram','ex','favs','hist','more'];
function go(name,opt={}){
  if(!VIEW_NAMES.includes(name))name='home';
  activeView=name;
  document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='v-'+name);
  document.querySelectorAll('nav button').forEach(b=>{const on=b.dataset.go===name;b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  if(location.hash.slice(1)!==name)location.hash=name;   // يضيف خطوة في السجل ليعمل زر الرجوع بين التبويبات
  if(opt.render!==false)views[name]();
  window.scrollTo(0,0);
}
async function openWord(en){
  const x=await safe(()=>DB.get('words',en));
  go('home',{render:false});
  $('#results').innerHTML='';$('#q').value='';
  await show(x,$('#home-card'));
}
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h!==activeView)go(h)});

document.addEventListener('click',async e=>{
  const g=e.target.closest('[data-go]');if(g)return go(g.dataset.go);
  const ge=e.target.closest('[data-gex]');if(ge){go('ex',{render:false});return Ex.start(ge.dataset.gex)}
  const it=e.target.closest('.item[data-en]');if(it)return openWord(it.dataset.en);
  const ea=e.target.closest('#ex-body [data-a]');if(ea)return Ex.pick(ea.dataset.a);
  const x=e.target.closest('[data-x]');
  if(x){const k=x.dataset.x;
    if(k==='submit')Ex.submit();else if(k==='next')Ex.next();else if(k==='selfok')Ex.self(true);else if(k==='selfno')Ex.self(false);
    else if(k==='home')Ex.home();
    else if(k==='reset'){if(confirm('مسح نتائج التدريب؟'))DB.clear('attempts').then(()=>Ex.home()).catch(()=>{})}
    else Ex.start(k);
    return;
  }
  const a=e.target.closest('[data-act]');if(!a||!current)return;
  if(a.dataset.act==='speak'&&!Dict.speak(current.en))alert('جهازك لا يدعم النطق الصوتي.');
  if(a.dataset.act==='fav'){
    const f=await safe(()=>Dict.toggleFav(current));
    if(f!==undefined)a.textContent=f?'محفوظة ✓':'حفظ';
  }
});

// بحث: تأخير بسيط + تجاهل النتائج القديمة لو وصلت متأخرة
let searchSeq=0,searchTimer=0;
$('#q').addEventListener('input',e=>{
  clearTimeout(searchTimer);
  const q=e.target.value,r=$('#results'),my=++searchSeq;
  if(!q.trim()){r.innerHTML='';return}
  searchTimer=setTimeout(async()=>{
    const list=await safe(()=>Dict.search(q),r,'تعذر البحث الآن.');
    if(my!==searchSeq||!list)return;
    renderList(list,r,'لا توجد نتيجة. جرّب كلمة إنجليزية أو معناها بالعربي.');
  },120);
});
$('#clear-hist').addEventListener('click',async()=>{if(confirm('مسح سجل البحث؟')){await safe(()=>DB.clear('history'));views.hist()}});

window.addEventListener('unhandledrejection',e=>{console.error('unhandled',e.reason)});

(async()=>{
  try{await Dict.init()}catch(err){
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin','<p class="err">تعذر فتح قاعدة البيانات. تأكد أنك لا تتصفح في وضع التصفح الخاص.</p>');return}
  go(location.hash.slice(1)||'home');
  if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});  // يحمي البيانات من المسح التلقائي
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
