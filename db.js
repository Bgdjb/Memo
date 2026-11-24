// طبقة IndexedDB: words / favorites / history / settings / attempts
const DB=(()=>{
  let d=null,opening=null;
  const KEYS={words:'en',favorites:'en',settings:'key'};
  const HISTORY_MAX=300;
  function open(){
    if(d)return Promise.resolve(d);
    if(opening)return opening;
    opening=new Promise((res,rej)=>{
      if(!('indexedDB' in window)){opening=null;return rej(new Error('no-idb'))}
      const r=indexedDB.open('memo2',2);
      r.onupgradeneeded=e=>{const x=e.target.result;
        for(const s of ['words','favorites','settings'])if(!x.objectStoreNames.contains(s))x.createObjectStore(s,{keyPath:KEYS[s]});
        if(!x.objectStoreNames.contains('attempts'))x.createObjectStore('attempts',{keyPath:'id',autoIncrement:true});
        if(!x.objectStoreNames.contains('history'))x.createObjectStore('history',{keyPath:'id',autoIncrement:true});};
      r.onsuccess=()=>{d=r.result;opening=null;
        d.onversionchange=()=>{d.close();d=null};   // تبويب آخر يرقّي القاعدة
        d.onclose=()=>{d=null};
        res(d)};
      r.onerror=()=>{opening=null;rej(r.error)};
      r.onblocked=()=>{};
    });
    return opening;
  }
  async function tx(s,mode,fn){
    const db=await open();
    return new Promise((res,rej)=>{
      let t,q;
      try{t=db.transaction(s,mode);q=fn(t.objectStore(s))}catch(err){return rej(err)}
      t.oncomplete=()=>res(q&&q.result);
      t.onerror=()=>rej(t.error);
      t.onabort=()=>rej(t.error||new Error('aborted'));
    });
  }
  const api={
    put:(s,v)=>tx(s,'readwrite',o=>o.put(v)),
    get:(s,k)=>tx(s,'readonly',o=>o.get(k)),
    del:(s,k)=>tx(s,'readwrite',o=>o.delete(k)),
    all:s=>tx(s,'readonly',o=>o.getAll()),
    count:s=>tx(s,'readonly',o=>o.count()),
    clear:s=>tx(s,'readwrite',o=>o.clear()),
    async putMany(s,list){          // معاملة واحدة بدل مئات المعاملات
      const db=await open();
      return new Promise((res,rej)=>{
        const t=db.transaction(s,'readwrite'),o=t.objectStore(s);
        list.forEach(v=>o.put(v));
        t.oncomplete=()=>res();t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('aborted'));
      });
    },
    async setting(k,v){
      if(v===undefined){const r=await api.get('settings',k);return r&&r.value}
      return api.put('settings',{key:k,value:v});
    },
    async trimHistory(){            // يحذف الأقدم لو تجاوز الحد
      const n=await api.count('history');if(n<=HISTORY_MAX)return;
      const all=(await api.all('history')).sort((a,b)=>a.at-b.at);
      const db=await open();
      return new Promise((res,rej)=>{
        const t=db.transaction('history','readwrite'),o=t.objectStore('history');
        all.slice(0,n-HISTORY_MAX).forEach(r=>o.delete(r.id));
        t.oncomplete=()=>res();t.onerror=()=>rej(t.error);
      });
    }
  };
  return api;
})();
