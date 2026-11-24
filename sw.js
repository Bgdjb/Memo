const C='memo2-v4';
const CORE=['./','index.html','style.css','app.js','db.js','dictionary.js','grammar.js','library.js','exercises.js','manifest.json',
 'data/grammar-library.json','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable-512.png','assets/bg.jpg'];
// ملف ناقص لا يُفشل التثبيت كله (addAll كان يفشل لو ملف واحد غير موجود)
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
// stale-while-revalidate: يفتح فورًا من الكاش ويحدّث في الخلفية
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(C);
    const hit=await cache.match(req,{ignoreSearch:true});
    const net=fetch(req).then(r=>{if(r&&r.ok)cache.put(req,r.clone());return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const r=await net;
    if(r)return r;
    if(req.mode==='navigate'){const home=await cache.match('index.html');if(home)return home}
    return new Response('',{status:504,statusText:'offline'});
  })());
});
