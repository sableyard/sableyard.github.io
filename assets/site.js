(()=>{
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const h=document.querySelector('header.site');
const sc=()=>h&&h.classList.toggle('scrolled',scrollY>8);
addEventListener('scroll',sc,{passive:true});sc();
const els=[...document.querySelectorAll('.reveal')];
if(rm||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'))}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});els.forEach(e=>io.observe(e))}
const ph=document.querySelector('.phone');
if(ph&&!rm&&matchMedia('(hover:hover)').matches){let f=0;addEventListener('pointermove',e=>{if(f)return;f=requestAnimationFrame(()=>{f=0;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;ph.style.transform='perspective(1100px) rotateY('+(x*9).toFixed(2)+'deg) rotateX('+(-y*7).toFixed(2)+'deg)'})},{passive:true})}
const chips=document.querySelectorAll('[data-model]'),model=document.getElementById('model'),who=document.getElementById('who'),reply=document.getElementById('reply');
if(chips.length&&reply){const msg='Sure. Here is a short, clear answer to your question.';let t;
const type=()=>{clearTimeout(t);if(rm){reply.textContent=msg;return}let i=0;reply.textContent='';(function s(){reply.textContent=msg.slice(0,++i);if(i<msg.length)t=setTimeout(s,18)})()};
chips.forEach(c=>c.addEventListener('click',()=>{chips.forEach(x=>x.setAttribute('aria-pressed',String(x===c)));model.textContent=who.textContent=c.dataset.model;type()}));
const io2=new IntersectionObserver(es=>{if(es[0].isIntersecting){type();io2.disconnect()}},{threshold:.4});io2.observe(document.querySelector('.phone'))}

if(h){const p=document.createElement('i');p.className='prog';h.appendChild(p);
 const up=()=>{const m=document.documentElement.scrollHeight-innerHeight;p.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0).toFixed(4)+')'};
 addEventListener('scroll',up,{passive:true});addEventListener('resize',up);up()}
if(!rm)document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true}));
const R=window.RELEASE||{},set=(s,v)=>{if(v)document.querySelectorAll(s).forEach(e=>e.textContent=v)};
set('[data-version]',R.version);set('[data-date]',R.date);set('[data-size]',R.size);set('[data-sha]',R.sha256);
if(R.apkUrl)document.querySelectorAll('[data-download]').forEach(a=>{a.href=R.apkUrl;a.removeAttribute('aria-disabled');a.textContent='Download v'+(R.version||'')+' for Android'});
})();
