// القاموس: بيانات قابلة للتحديث عبر رفع DICT_VERSION. المستويات تقريبية وليست رسمية.
const DICT_VERSION=2;
const w=(en,ipa,pron,pos,ar,def,level,ex,syn,ant)=>({en,ipa,pron,pos,ar,def,level,ex,syn:syn||[],ant:ant||[]});
const SEED=[
w('serendipity','/ˌserənˈdɪpəti/','سيرندبتي','Noun','المصادفة السعيدة','The occurrence of events by chance in a happy or beneficial way.','C1',[['Finding that old book was pure serendipity.','كان العثور على ذلك الكتاب القديم مصادفة سعيدة بحتة.']],['luck','fortune'],['misfortune']),
w('resilient','/rɪˈzɪliənt/','ريزيليانت','Adjective','مرن، قادر على التعافي','Able to recover quickly from difficulties.','C1',[['Children are often more resilient than adults think.','الأطفال غالبًا أكثر مرونة مما يظن الكبار.']],['tough','flexible'],['fragile']),
w('ambiguous','/æmˈbɪɡjuəs/','أمبيجيوس','Adjective','غامض، يحتمل أكثر من معنى','Having more than one possible meaning.','C1',[['The question was ambiguous, so I asked again.','كان السؤال غامضًا فسألت مرة أخرى.']],['unclear','vague'],['clear','obvious']),
w('benefit','/ˈbenɪfɪt/','بنفيت','Noun','فائدة','An advantage or good result from something.','B1',[['Exercise has many health benefits.','للتمرين فوائد صحية كثيرة.']],['advantage','gain'],['disadvantage','harm']),
w('achieve','/əˈtʃiːv/','أتشيف','Verb','يحقق، ينجز','To succeed in reaching a goal through effort.','B1',[['She worked hard to achieve her goals.','عملت بجد لتحقق أهدافها.']],['accomplish','attain'],['fail']),
w('curious','/ˈkjʊriəs/','كيوريس','Adjective','فضولي','Eager to know or learn something.','B1',[['He is curious about how machines work.','هو فضولي لمعرفة كيف تعمل الآلات.']],['inquisitive','interested'],['uninterested']),
w('efficient','/ɪˈfɪʃnt/','إفيشنت','Adjective','كفء، فعّال','Working well without wasting time or effort.','B2',[['An efficient plan saves time.','الخطة الفعّالة توفر الوقت.']],['effective','productive'],['wasteful','inefficient']),
w('environment','/ɪnˈvaɪrənmənt/','إنفايرنمنت','Noun','البيئة','The natural world, or the conditions around a person or thing.','B1',[['We must protect the environment.','يجب أن نحمي البيئة.']],['surroundings','habitat'],[]),
w('knowledge','/ˈnɒlɪdʒ/','نوليدج','Noun','المعرفة','Information and understanding gained through learning.','A2',[['Knowledge is power.','المعرفة قوة.']],['understanding','learning'],['ignorance']),
w('opportunity','/ˌɒpəˈtjuːnəti/','أوبرتيونيتي','Noun','فرصة','A chance to do something good.','B1',[['This job is a great opportunity.','هذه الوظيفة فرصة رائعة.']],['chance','opening'],['obstacle']),
w('responsible','/rɪˈspɒnsəbl/','ريسبونسيبل','Adjective','مسؤول','Having a duty to take care of something or someone.','B1',[['He is responsible for the project.','هو مسؤول عن المشروع.']],['accountable','reliable'],['irresponsible']),
w('improve','/ɪmˈpruːv/','إمبروف','Verb','يحسّن، يتحسن','To become better or make something better.','A2',[['Reading daily will improve your English.','القراءة اليومية ستحسّن إنجليزيتك.']],['enhance','develop'],['worsen']),
w('convince','/kənˈvɪns/','كنفينس','Verb','يُقنع','To make someone believe or agree with something.','B2',[['She convinced me to join the club.','أقنعتني بالانضمام إلى النادي.']],['persuade'],['discourage']),
w('essential','/ɪˈsenʃl/','إسنشل','Adjective','ضروري، أساسي','Absolutely necessary.','B1',[['Water is essential for life.','الماء ضروري للحياة.']],['vital','necessary'],['unnecessary']),
w('rely','/rɪˈlaɪ/','ريلاي','Verb','يعتمد على','To depend on someone or something.','B2',[['You can rely on me.','يمكنك الاعتماد عليّ.']],['depend','count on'],['doubt']),
w('increase','/ɪnˈkriːs/','إنكريس','Verb','يزيد، يرتفع','To become or make something bigger or more.','B1',[['Prices increase every year.','الأسعار ترتفع كل عام.']],['grow','rise'],['decrease','reduce']),
w('reduce','/rɪˈdjuːs/','ريديوس','Verb','يقلل، يخفّض','To make something smaller or less.','B1',[['We must reduce waste.','يجب أن نقلل الهدر.']],['lessen','cut'],['increase']),
w('prevent','/prɪˈvent/','بريفنت','Verb','يمنع، يحول دون','To stop something from happening.','B2',[['Vaccines prevent many diseases.','اللقاحات تمنع أمراضًا كثيرة.']],['stop','avoid'],['allow','cause']),
w('support','/səˈpɔːt/','سبورت','Verb','يدعم، يؤيد','To help someone or agree with them.','B1',[['My family always supports me.','عائلتي تدعمني دائمًا.']],['help','back'],['oppose']),
w('ability','/əˈbɪləti/','أبيليتي','Noun','القدرة، المهارة','The skill or power to do something.','B1',[['She has the ability to learn fast.','لديها القدرة على التعلم بسرعة.']],['skill','talent'],['inability']),
w('challenge','/ˈtʃælɪndʒ/','تشالنج','Noun','تحدٍّ','Something difficult that tests your ability.','B2',[['Learning a new language is a challenge.','تعلّم لغة جديدة تحدٍّ.']],['difficulty','test'],[]),
w('generous','/ˈdʒenərəs/','جنرس','Adjective','كريم، سخي','Happy to give more than is expected.','B1',[['He is generous with his time.','هو كريم بوقته.']],['kind','giving'],['selfish','mean']),
w('honest','/ˈɒnɪst/','أونست','Adjective','صادق، أمين','Telling the truth and not cheating.','A2',[['Please be honest with me.','من فضلك كن صادقًا معي.']],['truthful','sincere'],['dishonest']),
w('patient','/ˈpeɪʃnt/','بيشنت','Adjective','صبور','Able to wait calmly without getting angry.','B1',[['Teachers must be patient.','يجب أن يكون المعلمون صبورين.']],['calm','tolerant'],['impatient']),
w('ancient','/ˈeɪnʃənt/','إينشنت','Adjective','قديم، أثري','Very old, from a long time ago.','B1',[['Egypt is full of ancient temples.','مصر مليئة بالمعابد القديمة.']],['old','historic'],['modern']),
w('invent','/ɪnˈvent/','إنفنت','Verb','يخترع','To create something completely new.','B1',[['Who invented the telephone?','من اخترع الهاتف؟']],['create','design'],[]),
w('discover','/dɪˈskʌvə/','ديسكفر','Verb','يكتشف','To find something for the first time.','A2',[['Scientists discovered a new planet.','اكتشف العلماء كوكبًا جديدًا.']],['find','uncover'],['hide']),
w('population','/ˌpɒpjuˈleɪʃn/','بوبيوليشن','Noun','عدد السكان','The number of people living in a place.','B1',[['The population of Cairo is very large.','عدد سكان القاهرة كبير جدًا.']],['inhabitants'],[]),
w('pollution','/pəˈluːʃn/','بلوشن','Noun','التلوث','Harmful substances that damage air, water or land.','B1',[['Air pollution is a serious problem.','تلوث الهواء مشكلة خطيرة.']],['contamination'],[]),
w('recycle','/ˌriːˈsaɪkl/','ريسايكل','Verb','يعيد التدوير','To process used materials so they can be used again.','B1',[['We recycle paper and plastic.','نعيد تدوير الورق والبلاستيك.']],['reuse'],['waste']),
w('advantage','/ədˈvɑːntɪdʒ/','أدفانتيج','Noun','ميزة','Something that puts you in a better position.','B1',[['Speaking English is an advantage.','التحدث بالإنجليزية ميزة.']],['benefit','strength'],['disadvantage']),
w('attend','/əˈtend/','أتند','Verb','يحضر','To be present at an event or place.','B1',[['She attends English classes twice a week.','تحضر حصص اللغة الإنجليزية مرتين أسبوعيًا.']],['go to','be present'],['miss']),
w('purpose','/ˈpɜːpəs/','بيربس','Noun','هدف، غرض','The reason why something is done or exists.','B1',[['What is the purpose of this meeting?','ما الغرض من هذا الاجتماع؟']],['aim','goal'],[]),
w('participate','/pɑːˈtɪsɪpeɪt/','بارتيسيبيت','Verb','يشارك','To take part in an activity.','B2',[['All students must participate in the project.','يجب أن يشارك كل الطلاب في المشروع.']],['take part','join'],['withdraw']),
w('tradition','/trəˈdɪʃn/','تراديشن','Noun','تقليد، عادة موروثة','A custom passed down through generations.','B1',[['It is a tradition to eat kahk at Eid.','من التقاليد أكل الكحك في العيد.']],['custom'],[]),
w('celebrate','/ˈselɪbreɪt/','سيليبريت','Verb','يحتفل','To do something special for an important day or event.','A2',[['We celebrate Eid with our families.','نحتفل بالعيد مع عائلاتنا.']],['mark','commemorate'],[])
];
// تطبيع النص للبحث: حروف صغيرة، حذف التشكيل، توحيد الألف والياء والتاء المربوطة
const norm=s=>String(s==null?'':s).toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim();
const Dict={
  async init(){
    if((await DB.setting('dictVersion'))===DICT_VERSION)return;
    await DB.putMany('words',SEED);
    await DB.setting('dictVersion',DICT_VERSION);
  },
  all:()=>DB.all('words'),
  async search(q){
    q=norm(q);if(!q)return[];
    const a=await DB.all('words');
    const hit=x=>{const en=x.en.toLowerCase(),ar=norm(x.ar);
      return en.startsWith(q)?0:en.includes(q)?1:ar.includes(q)?2:(x.syn||[]).some(s=>s.toLowerCase().includes(q))?3:9};
    return a.map(x=>[hit(x),x]).filter(p=>p[0]<9).sort((m,n)=>m[0]-n[0]||m[1].en.localeCompare(n[1].en)).map(p=>p[1]).slice(0,40);
  },
  async wordOfDay(){
    const a=(await DB.all('words')).sort((m,n)=>m.en.localeCompare(n.en));
    return a.length?a[Math.floor(Date.now()/864e5)%a.length]:null;
  },
  speak(t){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return false;
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u);return true}catch(e){return false}
  },
  isFav:async en=>!!(await DB.get('favorites',en)),
  async toggleFav(x){if(await this.isFav(x.en)){await DB.del('favorites',x.en);return false}await DB.put('favorites',{en:x.en,at:Date.now()});return true},
  async favorites(){const f=(await DB.all('favorites')).sort((a,b)=>b.at-a.at);const out=[];
    for(const r of f){const x=await DB.get('words',r.en);if(x)out.push(x)}return out},
  async logView(x){try{await DB.put('history',{en:x.en,at:Date.now()});DB.trimHistory().catch(()=>{})}catch(e){}},
  async history(){const h=(await DB.all('history')).sort((a,b)=>b.at-a.at);const seen=new Set(),out=[];
    for(const r of h){if(seen.has(r.en))continue;seen.add(r.en);const x=await DB.get('words',r.en);if(x)out.push(x);if(out.length>=50)break}return out}
};
