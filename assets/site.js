(()=>{
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,hov=matchMedia('(hover:hover)').matches,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const R=document.documentElement,h=$('header.site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* ambient background: drifting light, scroll parallax, cursor glow */
const amb=document.createElement('div');amb.className='amb';amb.innerHTML='<i></i><i></i><i></i>';document.body.prepend(amb);
if(!rm&&hov){const cur=document.createElement('div');cur.className='cur';document.body.prepend(cur);let x=innerWidth/2,y=innerHeight/3,tx=x,ty=y,raf=0;
 const loop=()=>{x+=(tx-x)*.1;y+=(ty-y)*.1;cur.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';raf=Math.abs(tx-x)+Math.abs(ty-y)>.5?requestAnimationFrame(loop):0};
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop)},{passive:true});loop()}
/* scroll: header state, progress line, parallax */
const stage=$('.stage'),prog=h&&Object.assign(document.createElement('i'),{className:'prog'});if(h)h.appendChild(prog);
let tick=0;const onScroll=()=>{if(tick)return;tick=requestAnimationFrame(()=>{tick=0;const y=scrollY;
 if(h){h.classList.toggle('scrolled',y>8);const m=R.scrollHeight-innerHeight;prog.style.transform='scaleX('+(m>0?Math.min(1,y/m):0).toFixed(4)+')'}
 if(!rm){R.style.setProperty('--sy',y);if(stage&&y<1000)stage.style.translate='0 '+(y*-.05).toFixed(1)+'px'}})};
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
/* headings: word-by-word mask reveal */
if(!rm)$$('main h1,main h2').forEach(el=>{if(el.closest('.policy'))return;let i=0;
 const walk=n=>[...n.childNodes].forEach(c=>{
  if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(' '));else{const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.style.setProperty('--i',i++);s.textContent=t;w.appendChild(s);f.appendChild(w)}});c.replaceWith(f)}
  else if(c.nodeType===1){if(c.classList.contains('s')){const w=document.createElement('span');w.className='w';c.replaceWith(w);c.style.display='inline-block';c.style.setProperty('--i',i++);w.appendChild(c)}else walk(c)}});
 walk(el);el.classList.add('split')});
/* reveal on scroll */
const els=$$('.reveal');
if(rm||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));$$('main section').forEach(e=>e.classList.add('in'))}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});els.forEach(e=>io.observe(e));$$('main section').forEach(e=>io.observe(e))}
/* interactions */
const ph=$('.stage .phone');
if(ph&&!rm&&hov){let f=0;addEventListener('pointermove',e=>{if(f)return;f=requestAnimationFrame(()=>{f=0;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;ph.style.transform='perspective(1100px) rotateY('+(x*9).toFixed(2)+'deg) rotateX('+(-y*7).toFixed(2)+'deg)'})},{passive:true})}
if(!rm)$$('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true}));
if(!rm&&hov)$$('.btn:not(.sm)').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.14).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.22).toFixed(1)+'px'});b.addEventListener('pointerleave',()=>b.style.translate='')});
/* numbers resolve */
$$('[data-count]').forEach(el=>{const to=+el.dataset.count;if(rm||!('IntersectionObserver' in window)){el.textContent=to;return}el.textContent=9;
 const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1500),e=1-Math.pow(1-k,3);el.textContent=Math.round(9+(to-9)*e);if(k<1)requestAnimationFrame(f)})(t0)},{threshold:.6});io.observe(el)});
/* release info */
const REL=window.RELEASE||{},set=(s,v)=>{if(v)$$(s).forEach(e=>e.textContent=v)};
set('[data-version]',REL.version);set('[data-date]',REL.date);set('[data-size]',REL.size);set('[data-sha]',REL.sha256);
if(REL.apkUrl)$$('[data-download]').forEach(a=>{a.href=REL.apkUrl;a.removeAttribute('aria-disabled');a.textContent='Download v'+(REL.version||'')+' for Android'});
/* nav */
const mb=$('.menu'),nv=$('#nav');
if(mb&&nv){const cl=()=>{nv.classList.remove('open');mb.setAttribute('aria-expanded','false')};mb.addEventListener('click',()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',String(o))});nv.addEventListener('click',e=>{if(e.target.closest('a'))cl()});addEventListener('keydown',e=>{if(e.key==='Escape')cl()})}
const here=location.pathname.replace(/index\.html$/,'');
$$('nav a:not(.btn)').forEach(a=>{if(!a.hash&&a.pathname.replace(/index\.html$/,'')===here)a.setAttribute('aria-current','page')});
const ann=$('.ann');if(ann)$('.ann button').addEventListener('click',()=>ann.remove());
const fl=$('.float'),ft=$('footer.site');if(fl){const t=()=>fl.classList.toggle('show',scrollY>700&&ft.getBoundingClientRect().top>innerHeight-40);addEventListener('scroll',t,{passive:true});t()}
/* chapter dots */
const L={how:'How it works',features:'Features',privacy:'Privacy',faq:'Questions'},secs=Object.keys(L).map(id=>document.getElementById(id)).filter(Boolean);
if(secs.length>2&&'IntersectionObserver' in window){const d=document.createElement('nav');d.className='dots';d.setAttribute('aria-label','Sections');d.innerHTML=secs.map(s=>'<a href="#'+s.id+'" data-t="'+L[s.id]+'" aria-label="'+L[s.id]+'"></a>').join('');document.body.appendChild(d);
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)d.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -45% 0px'});secs.forEach(s=>io.observe(s))}
/* sticky how-it-works: the phone and the background follow the step */
const how=$('.how');
if(how&&'IntersectionObserver' in window){const st=$$('.step');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){st.forEach(s=>s.classList.toggle('on',s===e.target));how.dataset.step=e.target.dataset.n;R.dataset.step=e.target.dataset.n}}),{rootMargin:'-42% 0px -42% 0px'});st.forEach(s=>io.observe(s));
 new IntersectionObserver(es=>{if(!es[0].isIntersecting)delete R.dataset.step},{threshold:0}).observe(how)}
else if(how){$$('.step').forEach(s=>s.classList.add('on'))}
/* hero demo */
const msgs=$('#msgs'),model=$('#model'),pill=$('#pill'),sheet=$('#sheet');
if(msgs){let run=0;
 const sync=m=>{$$('[data-model]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.model===m)));amb.classList.add('boost');setTimeout(()=>amb.classList.remove('boost'),1000)};
 const add=(c,t)=>{const p=document.createElement('p');p.className=c+' in';p.innerHTML=t;msgs.appendChild(p);return p};
 const type=async(el,t,id)=>{for(let i=1;i<=t.length;i++){if(id!==run)return false;el.textContent=t.slice(0,i);await sleep(16)}return true};
 const Q='Explain compound interest in two sentences.',A1='It is interest that earns interest: each period&rsquo;s earnings join the balance, so the next period earns on a bigger base. Over time that snowballs.',A2='Interest that earns interest.';
 const dec=s=>{const d=document.createElement('textarea');d.innerHTML=s;return d.value};
 const demo=async id=>{while(id===run){
  msgs.innerHTML='';model.textContent='OpenAI';sync('OpenAI');await sleep(700);if(id!==run)return;
  add('u',Q);await sleep(500);
  let a=add('a','<small>OpenAI</small><span></span>');if(!await type(a.lastChild,dec(A1),id))return;
  await sleep(900);pill.classList.add('hl');await sleep(500);sheet.classList.add('show');await sleep(1000);
  sheet.querySelector('[data-r="Anthropic"]').classList.add('sel');await sleep(600);sheet.classList.remove('show');pill.classList.remove('hl');model.textContent='Anthropic';sync('Anthropic');
  await sleep(500);if(id!==run)return;sheet.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'));
  add('u','Shorter.');await sleep(500);
  a=add('a','<small>Anthropic</small><span></span>');if(!await type(a.lastChild,A2,id))return;
  await sleep(3600)}};
 if(!rm&&'IntersectionObserver' in window){new IntersectionObserver(es=>{run++;if(es[0].isIntersecting)demo(run)},{threshold:.45}).observe($('#demo'))}
 $$('[data-model]').forEach(c=>c.addEventListener('click',async()=>{run++;const id=run,m=c.dataset.model;sheet.classList.remove('show');pill.classList.remove('hl');sync(m);
  msgs.innerHTML='';model.textContent=m;add('u',Q);const a=add('a','<small>'+m+'</small><span></span>');const t=dec(A1);
  if(rm){a.lastChild.textContent=t}else await type(a.lastChild,t,id)}));
}
})();
