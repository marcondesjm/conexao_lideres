(() => {
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const small=matchMedia('(max-width: 620px)');
const header=document.querySelector('header'), toggle=document.querySelector('.menu-toggle');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
document.querySelectorAll('header nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(document.activeElement.closest('header nav'))toggle.focus();}});
const ribbon=document.querySelector('.ribbon'),set=document.createElement('div');set.className='ribbon-set';while(ribbon.firstChild)set.append(ribbon.firstChild);const track=document.createElement('div');track.className='ribbon-track';const duplicate=set.cloneNode(true);duplicate.setAttribute('aria-hidden','true');track.append(set,duplicate);ribbon.append(track);
const gallery=document.querySelector('.detail-gallery'),prev=document.querySelector('.gallery-prev'),next=document.querySelector('.gallery-next');
function galleryState(){prev.disabled=gallery.scrollLeft<4;next.disabled=gallery.scrollLeft+gallery.clientWidth>=gallery.scrollWidth-4;}
function slide(direction){const card=gallery.querySelector('figure');gallery.scrollBy({left:direction*(card.getBoundingClientRect().width+parseFloat(getComputedStyle(gallery).gap)),behavior:reduce.matches?'instant':'smooth'});}
prev.addEventListener('click',()=>slide(-1));next.addEventListener('click',()=>slide(1));gallery.addEventListener('scroll',galleryState,{passive:true});gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();slide(e.key==='ArrowRight'?1:-1);}});galleryState();
const chapters=[...document.querySelectorAll('.pillars article')],chapterLinks=[...document.querySelectorAll('.story-labels a')];
const progress=document.querySelector('.reading-progress'),hero=document.querySelector('.hero-art'),heroSection=document.querySelector('.hero'),story=document.querySelector('.story-visual'),bar=document.querySelector('.story-track>span'),scene=document.querySelector('.connection-scene'),sceneImage=document.querySelector('.scene-image'),sceneWord=document.querySelector('.scene-word'),floating=document.querySelector('.floating-cta'),contact=document.querySelector('#contato');
const navLinks=[...document.querySelectorAll('header nav a')],navTargets=navLinks.map(a=>document.querySelector(a.getAttribute('href')));
let words=[];
if(!reduce.matches){
 const phrase=document.querySelector('.statement p');
 const walk=document.createTreeWalker(phrase,NodeFilter.SHOW_TEXT);const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);
 nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part))fragment.append(document.createTextNode(part));else{const word=document.createElement('span');word.className='word';word.textContent=part;fragment.append(word);words.push(word);}});node.replaceWith(fragment);});
 if('IntersectionObserver' in window){document.body.classList.add('motion-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.about>div,.section-top,.speaker-card,.ecosystem-stats>div,.sponsor-card,.reach-stats>div,.activation-list>div,.venue-content,.sponsor-layout>*,.faq>div,.closing h2,.scene-content>*').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%2)*90+'ms';io.observe(el);});}
}
if(!reduce.matches && 'IntersectionObserver' in window){const counts=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;counts.unobserve(e.target);const target=Number(e.target.dataset.counter),start=performance.now();function tick(now){const t=Math.min(1,(now-start)/1300),v=Math.round(target*(1-Math.pow(1-t,3)));e.target.textContent=v.toLocaleString('pt-BR');if(t<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}),{threshold:.8});document.querySelectorAll('[data-counter]').forEach(el=>counts.observe(el));}
let queued=false;
function render(){
 queued=false;const y=scrollY,h=innerHeight,total=document.documentElement.scrollHeight-h;
 progress.style.transform=`scaleX(${total>0?y/total:0})`;header.classList.toggle('is-scrolled',y>35);
 floating.classList.toggle('show',y>h*.9&&contact.getBoundingClientRect().top>h*.9);
 let selected=-1;navTargets.forEach((el,i)=>{if(el.getBoundingClientRect().top<h*.38)selected=i;});navLinks.forEach((a,i)=>{if(i===selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 let current=0,distance=Infinity;chapters.forEach((c,i)=>{const d=Math.abs(c.getBoundingClientRect().top+c.offsetHeight/2-h*.5);if(d<distance){distance=d;current=i;}});
 chapters.forEach((c,i)=>c.classList.toggle('is-active',i===current));chapterLinks.forEach((a,i)=>a.classList.toggle('is-active',i===current));bar.style.width=`${(current+1)*100/chapters.length}%`;
 if(!reduce.matches){
  story.style.setProperty('--story-scale',1+current*.09);
  if(!small.matches){if(y<h*1.5)hero.style.transform=`translateY(${Math.min(y*.18,140)}px)`;const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<h){const t=Math.max(-1,Math.min(1,(h*.5-r.top)/(r.height+h)));sceneImage.style.transform=`translateY(${t*110}px) scale(1.07)`;sceneWord.style.transform=`translateX(${t*-85}px)`;}}
  const phrase=document.querySelector('.statement p');const r=phrase.getBoundingClientRect();if(r.bottom>0&&r.top<h){const ratio=Math.max(0,Math.min(1,(h*.85-r.top)/(h*.48)));words.forEach((w,i)=>w.classList.toggle('lit',i<Math.ceil(ratio*words.length)));}
 }
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{galleryState();schedule();});reduce.addEventListener('change',()=>{if(reduce.matches){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));hero.style.transform='none';}schedule();});render();
if(!reduce.matches&&matchMedia('(pointer:fine)').matches){
 heroSection.addEventListener('pointermove',e=>{const r=heroSection.getBoundingClientRect();heroSection.style.setProperty('--light-x',((e.clientX-r.left)/r.width*100)+'%');heroSection.style.setProperty('--light-y',((e.clientY-r.top)/r.height*100)+'%');},{passive:true});
 const guest=document.querySelector('.pablo-card');guest.addEventListener('pointermove',e=>{const r=guest.getBoundingClientRect();guest.style.setProperty('--spot-x',((e.clientX-r.left)/r.width*100)+'%');guest.style.setProperty('--spot-y',((e.clientY-r.top)/r.height*100)+'%');},{passive:true});
}
// Ambient particles: a small canvas, paused offscreen and in background tabs.
const canvas=document.querySelector('#gold-dust'),ctx=canvas.getContext('2d');
if(ctx&&!reduce.matches){
 let width=0,height=0,visible=true,raf=0,last=0;const motes=Array.from({length:small.matches?12:30},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.3,v:Math.random()*.00007+.000025,a:Math.random()*.4+.15,phase:Math.random()*6.28}));
 function resize(){const r=heroSection.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}resize();addEventListener('resize',resize);
 function draw(time){raf=0;if(!visible||document.hidden||reduce.matches)return;raf=requestAnimationFrame(draw);if(time-last<40)return;const delta=Math.min(time-last,80);last=time;ctx.clearRect(0,0,width,height);motes.forEach(p=>{p.y-=p.v*delta;if(p.y<0)p.y=1;const x=p.x*width+Math.sin(time*.0003+p.phase)*18;ctx.beginPath();ctx.fillStyle=`rgba(237,188,115,${p.a*(.7+.3*Math.sin(time*.001+p.phase))})`;ctx.arc(x,p.y*height,p.r,0,Math.PI*2);ctx.fill();});}
 function resume(){if(!raf&&visible&&!document.hidden&&!reduce.matches){last=performance.now();raf=requestAnimationFrame(draw);}}
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}resume();}).observe(heroSection);}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else resume();});reduce.addEventListener('change',()=>{if(reduce.matches&&raf){cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,width,height);}else resume();});resume();
}
})();

// Animação discreta na seção de conexões.
(() => {
  const section = document.querySelector('.statement');
  if (!section) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(section.style, { position: 'relative', isolation: 'isolate', overflow: 'hidden' });
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '-1', pointerEvents: 'none' });
  section.prepend(canvas);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fish = Array.from({ length: 13 }, (_, i) => ({
    x: (i * 0.173 + 0.07) % 1, y: 0.12 + ((i * 0.317) % 0.76),
    size: 19 + (i % 4) * 3, speed: 9 + (i % 4) * 1.4,
    direction: i === 12 ? -1 : 1, gold: i === 12, phase: i * 1.7
  }));
  let width = 0, height = 0, frame = 0, last = 0, visible = true;
  function resize() {
    const rect = section.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced.matches) drawFish(0, 0);
  }
  function drawFish(time, delta) {
    context.clearRect(0, 0, width, height);
    fish.forEach(f => {
      f.x += f.direction * f.speed * delta / Math.max(width, 1);
      if (f.x > 1.08) f.x = -0.08;
      if (f.x < -0.08) f.x = 1.08;
      const sway = Math.sin(time * 0.0012 + f.phase);
      context.save();
      context.translate(f.x * width, f.y * height + sway * 3);
      context.scale(f.direction, 1);
      context.fillStyle = f.gold ? 'rgba(224,158,69,0.34)' : 'rgba(120,120,120,0.05)';
      context.beginPath();
      context.moveTo(f.size * 0.55, 0);
      context.bezierCurveTo(f.size * 0.15, -f.size * 0.26, -f.size * 0.21, -f.size * 0.22, -f.size * 0.37, 0);
      context.lineTo(-f.size * 0.64, -f.size * (0.17 + sway * 0.025));
      context.lineTo(-f.size * 0.57, 0);
      context.lineTo(-f.size * 0.64, f.size * (0.17 + sway * 0.025));
      context.lineTo(-f.size * 0.37, 0);
      context.bezierCurveTo(-f.size * 0.21, f.size * 0.22, f.size * 0.15, f.size * 0.26, f.size * 0.55, 0);
      context.fill(); context.restore();
    });
  }
  function tick(time) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    const delta = last ? Math.min((time - last) / 1000, 0.05) : 0;
    last = time; drawFish(time, delta); frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (reduced.matches) drawFish(0, 0);
    else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  resize();
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(section);
  sync();
})();
