// التدريبات: اختيار، إكمال، تصحيح، إعادة صياغة، ترجمة + تصحيح وشرح وتحليل أخطاء
const Ex={
  q:[],i:0,score:0,wrong:[],busy:false,pending:'',
  norm(s){return String(s).toLowerCase().replace(/[’‘`]/g,"'")
    .replace(/\bwon't\b/g,'will not').replace(/\bcan't\b/g,'can not').replace(/\bcannot\b/g,'can not').replace(/\bshan't\b/g,'shall not')
    .replace(/\bi'm\b/g,'i am').replace(/(\w)n't\b/g,'$1 not').replace(/(\w)'ve\b/g,'$1 have').replace(/(\w)'re\b/g,'$1 are').replace(/(\w)'ll\b/g,'$1 will')
    .replace(/[.,!?;:"()]/g,' ').replace(/\s+/g,' ').trim()},
  shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
  check(it,ans){
    if(it.t==='mcq')return Number(ans)===it.a;
    const n=this.norm(ans);return !!n&&it.a.some(x=>this.norm(x)===n);
  },
  async home(){
    let at=[];try{at=await DB.all('attempts')}catch(e){}const by={};
    at.forEach(a=>{const r=by[a.lesson]||(by[a.lesson]={n:0,ok:0});r.n++;if(a.ok)r.ok++});
    const rows=LESSONS.filter(l=>by[l.id]).map(l=>({l,p:Math.round(100*by[l.id].ok/by[l.id].n),n:by[l.id].n})).sort((a,b)=>a.p-b.p);
    $('#ex-body').innerHTML=`<p class="empty" style="padding:0 0 12px">اختر درسًا للتدريب.</p>`+LESSONS.map(l=>`<button class="item" data-x="${l.id}"><b dir="ltr">${esc(l.title)}</b><span>${esc(l.ar)}</span><i>${l.items.length} أسئلة</i></button>`).join('')+
     `<button class="btn primary" data-x="all" style="width:100%;margin:6px 0 18px">تدريب مختلط</button>`+
     `<h3>تحليل الأخطاء</h3>`+(rows.length?rows.map((r,k)=>`<p class="tags">${esc(r.l.ar)}: <b>${r.p}%</b> (${r.n} محاولة)${k===0&&r.p<100?' ← الأضعف':''}</p>`).join(''):'<p class="empty">حل بعض الأسئلة وسيظهر تحليلك هنا.</p>')+
     (rows.length?'<button class="btn ghost" data-x="reset" style="width:100%">مسح نتائج التدريب</button>':'');
  },
  start(id){
    let items;
    if(id==='all')items=this.shuffle(LESSONS.flatMap(l=>l.items.map(i=>({...i,lesson:l.id}))));
    else{const l=LESSONS.find(x=>x.id===id);if(!l)return this.home();items=l.items.map(i=>({...i,lesson:id}))}
    this.q=items;this.i=0;this.score=0;this.wrong=[];this.busy=false;this.pending='';this.show();
  },
  show(){
    const it=this.q[this.i];if(!it){return this.end()}
    this.busy=false;
    const body=it.t==='mcq'?it.o.map((o,k)=>`<button class="item" data-a="${k}" dir="ltr">${esc(o)}</button>`).join(''):
      `<input class="ans" id="ans" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="اكتب إجابتك"><button class="btn primary" data-x="submit" style="width:100%;margin-top:10px">تحقق</button>`;
    $('#ex-body').innerHTML=`<p class="tags">سؤال ${this.i+1} من ${this.q.length}</p><article class="card"><p dir="auto" style="font-size:1.15rem;line-height:1.7">${esc(it.q)}</p>${body}<div id="fb"></div></article>`;
    const a=$('#ans');if(a){a.focus();a.addEventListener('keydown',e=>{if(e.key==='Enter')this.submit()})}
  },
  async record(it,ok,ans){
    if(ok)this.score++;else this.wrong.push({it,ans});
    try{await DB.put('attempts',{lesson:it.lesson,type:it.t,ok,at:Date.now()})}catch(e){}   // فشل الحفظ لا يوقف التمرين
  },
  fb(it,ok,ans){
    const model=it.t==='mcq'?it.o[it.a]:it.a[0];
    $('#fb').innerHTML=`<p class="${ok?'ok':'bad'}">${ok?'إجابة صحيحة ✓':'إجابة غير صحيحة ✗'}</p>${ok?'':`<p dir="ltr" class="tags">الإجابة النموذجية: <b>${esc(model)}</b></p>`}<p class="def" style="text-align:start" dir="auto">${esc(it.e)}</p><button class="btn primary" data-x="next" style="width:100%">${this.i+1<this.q.length?'التالي':'النتيجة'}</button>`;
    document.querySelectorAll('#ex-body [data-a],[data-x=submit]').forEach(b=>b.disabled=true);
    const a=$('#ans');if(a)a.disabled=true;
  },
  async pick(k){if(this.busy)return;const it=this.q[this.i];if(!it)return;this.busy=true;const ok=this.check(it,k);await this.record(it,ok,k);this.fb(it,ok,k)},
  async submit(){
    if(this.busy)return;const it=this.q[this.i];if(!it)return;const v=($('#ans')||{}).value||'';if(!v.trim())return;
    this.busy=true;const ok=this.check(it,v);
    if(!ok&&it.t==='tr'){ // الترجمة لها صيغ صحيحة كثيرة: تقييم ذاتي
      this.pending=v;$('#fb').innerHTML=`<p dir="ltr" class="tags">إجابة نموذجية: <b>${esc(it.a[0])}</b></p><p class="tags">هل إجابتك بنفس المعنى والقواعد صحيحة؟</p><div class="btns"><button class="btn primary" data-x="selfok">نعم</button><button class="btn ghost" data-x="selfno">لا</button></div>`;return}
    await this.record(it,ok,v);this.fb(it,ok,v);
  },
  async self(ok){const it=this.q[this.i];if(!it||this.pending===null)return;const p=this.pending;this.pending=null;await this.record(it,ok,p);this.fb(it,ok,p)},
  next(){this.i++;this.pending='';this.show()},
  end(){
    $('#ex-body').innerHTML=`<article class="card"><h2>النتيجة: ${this.score} من ${this.q.length}</h2>${this.wrong.length?'<h3>راجع هذه الأسئلة</h3>'+this.wrong.map(w=>`<p dir="auto" class="tags">${esc(w.it.q)}<br><b dir="ltr">${esc(w.it.t==='mcq'?w.it.o[w.it.a]:w.it.a[0])}</b></p>`).join(''):'<p class="ok">ممتاز! كل الإجابات صحيحة.</p>'}<div class="btns"><button class="btn primary" data-x="home">رجوع للتدريبات</button></div></article>`;
  }
};
