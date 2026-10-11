(()=>{
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,hov=matchMedia('(hover:hover)').matches,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=document.documentElement,sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* ambient dot grid, lit near the pointer */
const amb=document.createElement('div');amb.className='amb';amb.innerHTML='<i></i><i></i>';document.body.prepend(amb);
if(!rm&&hov){let x=innerWidth*.7,y=innerHeight*.2,tx=x,ty=y,raf=0;const loop=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;amb.style.setProperty('--cx',x.toFixed(1)+'px');amb.style.setProperty('--cy',y.toFixed(1)+'px');raf=Math.abs(tx-x)+Math.abs(ty-y)>.5?requestAnimationFrame(loop):0};
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop)},{passive:true});loop()}
/* header, progress, rail */
const h=$('header.site'),rail=$('main.rail'),prog=h&&Object.assign(document.createElement('i'),{className:'prog'});if(h)h.appendChild(prog);
let tk=0;const onScroll=()=>{if(tk)return;tk=requestAnimationFrame(()=>{tk=0;const y=scrollY;
 if(h){h.classList.toggle('scrolled',y>8);const m=R.scrollHeight-innerHeight;prog.style.transform='scaleX('+(m>0?Math.min(1,y/m):0).toFixed(4)+')'}
 if(rail){const r=rail.getBoundingClientRect(),p=(innerHeight*.55-r.top)/r.height;rail.style.setProperty('--rp',Math.max(0,Math.min(1,p)).toFixed(4))}})};
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
/* headings: word-by-word mask reveal */
if(!rm)$$('main h1,main h2').forEach(el=>{if(el.closest('.policy'))return;let i=0;
 const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(' '));else{const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.style.setProperty('--i',i++);s.textContent=t;w.appendChild(s);f.appendChild(w)}});c.replaceWith(f)}else if(c.nodeType===1)walk(c)});
 walk(el);el.classList.add('split');el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim())});
/* reveal on scroll */
const els=$$('.reveal,section,.mark,.hero-art,.split');
if(rm||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'))}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});els.forEach(e=>io.observe(e))}
/* interactions */
const ph=$('.phone');
if(ph&&!rm&&hov){let f=0;addEventListener('pointermove',e=>{if(f)return;f=requestAnimationFrame(()=>{f=0;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;ph.style.transform='perspective(1100px) rotateY('+(x*8).toFixed(2)+'deg) rotateX('+(-y*6).toFixed(2)+'deg)'})},{passive:true})}
if(!rm&&hov)$$('.btn:not(.sm)').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.2).toFixed(1)+'px'});b.addEventListener('pointerleave',()=>b.style.translate='')});
$$('.copy').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);const t=b.textContent;b.textContent='copied';setTimeout(()=>b.textContent=t,1400)}catch(e){}}));
/* release info */
const REL=window.RELEASE||{},set=(s,v)=>{if(v)$$(s).forEach(e=>e.textContent=v)};
set('[data-version]',REL.version);set('[data-date]',REL.date);set('[data-size]',REL.size);set('[data-sha]',REL.sha256);
if(REL.apkUrl)$$('[data-download]').forEach(a=>{a.href=REL.apkUrl;a.removeAttribute('aria-disabled');a.textContent='Download v'+(REL.version||'')+' for Android'});
/* nav */
const mb=$('.menu'),nv=$('#nav');
if(mb&&nv){const cl=()=>{nv.classList.remove('open');mb.setAttribute('aria-expanded','false')};mb.addEventListener('click',()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',String(o))});nv.addEventListener('click',e=>{if(e.target.closest('a'))cl()});addEventListener('keydown',e=>{if(e.key==='Escape')cl()})}
const here=location.pathname.replace(/index\.html$/,'');$$('nav a:not(.btn)').forEach(a=>{if(!a.hash&&a.pathname.replace(/index\.html$/,'')===here)a.setAttribute('aria-current','page')});
const fl=$('.float'),ft=$('footer.site');if(fl){const t=()=>fl.classList.toggle('show',scrollY>800&&ft.getBoundingClientRect().top>innerHeight-40);addEventListener('scroll',t,{passive:true});t()}
/* hero demo: a chat that switches model mid-conversation */
const msgs=$('#msgs'),model=$('#model'),pill=$('#pill'),sheet=$('#sheet');
if(msgs){let run=0;
 const sync=m=>$$('[data-model]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.model===m)));
 const add=(c,t)=>{const p=document.createElement('p');p.className=c+' in';p.innerHTML=t;msgs.appendChild(p);return p};
 const type=async(el,t,id)=>{for(let i=1;i<=t.length;i++){if(id!==run)return false;el.textContent=t.slice(0,i);await sleep(16)}return true};
 const Q='Explain compound interest in two sentences.',A1='It is interest that earns interest: each period\u2019s earnings join the balance, so the next period earns on a bigger base. Over time that snowballs.',A2='Interest that earns interest.';
 const demo=async id=>{while(id===run){
  msgs.innerHTML='';model.textContent='OpenAI';sync('OpenAI');await sleep(700);if(id!==run)return;
  add('u',Q);await sleep(500);let a=add('a','<small>OpenAI</small><span></span>');if(!await type(a.lastChild,A1,id))return;
  await sleep(900);pill.classList.add('hl');await sleep(500);sheet.classList.add('show');await sleep(1000);
  sheet.querySelector('[data-r="Anthropic"]').classList.add('sel');await sleep(600);sheet.classList.remove('show');pill.classList.remove('hl');model.textContent='Anthropic';sync('Anthropic');
  await sleep(500);if(id!==run)return;sheet.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'));
  add('u','Shorter.');await sleep(500);a=add('a','<small>Anthropic</small><span></span>');if(!await type(a.lastChild,A2,id))return;await sleep(3600)}};
 if(!rm&&'IntersectionObserver' in window)new IntersectionObserver(es=>{run++;if(es[0].isIntersecting)demo(run)},{threshold:.4}).observe(ph);
 $$('[data-model]').forEach(c=>c.addEventListener('click',async()=>{run++;const id=run,m=c.dataset.model;sheet.classList.remove('show');pill.classList.remove('hl');sync(m);
  msgs.innerHTML='';model.textContent=m;add('u',Q);const a=add('a','<small>'+m+'</small><span></span>');if(rm)a.lastChild.textContent=A1;else await type(a.lastChild,A1,id)}));
}
})();
