/* =====================================================================
   js/08-zoom-e-trascinamento.js  -  ZOOM, SPOSTAMENTO E TRASCINAMENTO (mouse e tocco)
   Gestione dei puntatori: trascinare porte, fili e LED, pizzicare per
   ingrandire, trascinare lo sfondo per spostarsi.
   ===================================================================== */

const coordinateSvgDaSchermo=(x,y)=>{const p=lavagna.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(lavagna.getScreenCTM().inverse());};
const coordinateSvgDaEvento=e=>coordinateSvgDaSchermo(e.clientX,e.clientY);
const allineaAllaGriglia=v=>Math.round(v/10)*10;
function puntiInterniAutomatici(w){
  if(w.a[0]==='i')return[];
  const[x1,y1]=posizionePin(w.a),[x2,y2]=posizionePin(w.b),xm=x2>x1+40?(x1+x2)/2:x1+20;
  return[[xm,y1],[xm,y2]];
}
function puntiDelFilo(w){
  const e=posizionePin(w.b),inner=w.pts||puntiInterniAutomatici(w);
  const s=w.a[0]==='i'?[xIngresso(+w.a.slice(1)),(inner[0]||e)[1]]:posizionePin(w.a);
  return[s,...inner,e];
}
function aggiornaAreaVisibile(){
  const r=lavagna.clientHeight/lavagna.clientWidth;
  if(r&&isFinite(r))areaVisibile.h=areaVisibile.w*r;
  lavagna.setAttribute('viewBox',`${areaVisibile.x} ${areaVisibile.y} ${areaVisibile.w} ${areaVisibile.h}`);
  const u=areaVisibile.w/Math.max(lavagna.clientWidth,200),hr=Math.min(15,Math.max(11,22*u)),tr=Math.min(22,Math.max(13,22*u));
  lavagna.querySelectorAll('.ph').forEach(c=>c.setAttribute('r',hr));
  lavagna.querySelectorAll('.nd').forEach(c=>c.setAttribute('r',Math.max(8,hr*.75)));
  lavagna.querySelectorAll('.mp').forEach(c=>c.setAttribute('r',Math.max(6,hr*.5)));
  lavagna.querySelectorAll('circle.tg').forEach(c=>c.setAttribute('r',tr));
  lavagna.querySelectorAll('text.lt').forEach(t=>t.setAttribute('y',46-tr-6));
}
function ingrandisci(f,c){
  const nw=Math.min(3200,Math.max(160,areaVisibile.w/f)),k=nw/areaVisibile.w;
  areaVisibile.x=c.x-(c.x-areaVisibile.x)*k;areaVisibile.y=c.y-(c.y-areaVisibile.y)*k;areaVisibile.w=nw;areaVisibile.h=areaVisibile.h*k;aggiornaAreaVisibile();
}
function adattaAllaVista(){
  let mx=Math.max(800,posizioneLed.x+70),my=Math.max(440,posizioneLed.y+70);
  porteLavagna.forEach(g=>{mx=Math.max(mx,g.x+LARGHEZZA_PORTA[g.k]+60);my=Math.max(my,g.y+110);});
  filiLavagna.forEach(w=>(w.pts||[]).forEach(q=>{mx=Math.max(mx,q[0]+30);my=Math.max(my,q[1]+30);}));
  const rr=lavagna.clientHeight/lavagna.clientWidth||0.55;areaVisibile={x:0,y:0,w:Math.max(mx,my/rr),h:my};aggiornaAreaVisibile();
}
lavagna.addEventListener('pointerdown',e=>{
  puntatoriAttivi.set(e.pointerId,{x:e.clientX,y:e.clientY});
  try{lavagna.setPointerCapture(e.pointerId);}catch(err){}
  if(puntatoriAttivi.size===2){
    const[a,b]=[...puntatoriAttivi.values()];
    spostamentoSfondo=null;trascinamentoPorta=null;trascinamentoNodo=null;trascinamentoLed=null;pizzico={d:Math.hypot(a.x-b.x,a.y-b.y)};
    return;
  }
  const t=e.target,p=coordinateSvgDaEvento(e);let el,bg=false;
  if(el=t.closest('[data-pin]'))gestisciPin(el.dataset.pin,el.dataset.dir);
  else if(el=t.closest('[data-t]')){valoriIngressi[+el.dataset.t]^=1;messaggioRisultato='';}
  else if(el=t.closest('[data-nd]')){
    const[wi,k]=el.dataset.nd.split(':').map(Number),w=filiLavagna[wi],now=Date.now(),key=el.dataset.nd;
    w.pts=w.pts||puntiInterniAutomatici(w);
    if(now-ultimoTocco<350&&ultimoNodoToccato===key){w.pts.splice(k,1);if(!w.pts.length)delete w.pts;trascinamentoNodo=null;}
    else trascinamentoNodo={wi,k};
    ultimoTocco=now;ultimoNodoToccato=key;
  }
  else if(el=t.closest('[data-mp]')){
    const[wi,sg]=el.dataset.mp.split(':').map(Number),w=filiLavagna[wi];
    w.pts=w.pts||puntiInterniAutomatici(w);
    w.pts.splice(sg,0,[allineaAllaGriglia(p.x),allineaAllaGriglia(p.y)]);trascinamentoNodo={wi,k:sg};
  }
  else if(el=t.closest('[data-led]')){trascinamentoLed={dx:p.x-posizioneLed.x,dy:p.y-posizioneLed.y};selezione=null;pinInAttesa=null;}
  else if(el=t.closest('[data-g]')){
    const g=porteLavagna.find(g=>g.id==el.dataset.g);
    selezione={t:'g',i:g.id};trascinamentoPorta={g,dx:p.x-g.x,dy:p.y-g.y};pinInAttesa=null;
  }
  else if(el=t.closest('[data-w]')){selezione={t:'w',i:+el.dataset.w};pinInAttesa=null;}
  else{bg=true;spostamentoSfondo={sx:e.clientX,sy:e.clientY,vx:areaVisibile.x,vy:areaVisibile.y,moved:false};}
  if(!bg)disegnaCircuito();
});
lavagna.addEventListener('pointermove',e=>{
  if(puntatoriAttivi.has(e.pointerId))puntatoriAttivi.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pizzico&&puntatoriAttivi.size===2){
    const[a,b]=[...puntatoriAttivi.values()],d=Math.hypot(a.x-b.x,a.y-b.y);
    ingrandisci(d/pizzico.d,coordinateSvgDaSchermo((a.x+b.x)/2,(a.y+b.y)/2));pizzico.d=d;
    return;
  }
  if(spostamentoSfondo){
    if(Math.hypot(e.clientX-spostamentoSfondo.sx,e.clientY-spostamentoSfondo.sy)>4)spostamentoSfondo.moved=true;
    if(spostamentoSfondo.moved){const k=1/lavagna.getScreenCTM().a;areaVisibile.x=spostamentoSfondo.vx-(e.clientX-spostamentoSfondo.sx)*k;areaVisibile.y=spostamentoSfondo.vy-(e.clientY-spostamentoSfondo.sy)*k;aggiornaAreaVisibile();}
    return;
  }
  const p=coordinateSvgDaEvento(e);
  if(trascinamentoPorta){trascinamentoPorta.g.x=Math.max(xIngresso(numeroIngressi-1)+45,allineaAllaGriglia(p.x-trascinamentoPorta.dx));trascinamentoPorta.g.y=Math.max(55,allineaAllaGriglia(p.y-trascinamentoPorta.dy));}
  else if(trascinamentoNodo)filiLavagna[trascinamentoNodo.wi].pts[trascinamentoNodo.k]=[allineaAllaGriglia(p.x),allineaAllaGriglia(p.y)];
  else if(trascinamentoLed){posizioneLed.x=Math.max(xIngresso(numeroIngressi-1)+120,allineaAllaGriglia(p.x-trascinamentoLed.dx));posizioneLed.y=Math.max(55,allineaAllaGriglia(p.y-trascinamentoLed.dy));}
  else return;
  disegnaCircuito();
});
lavagna.addEventListener('wheel',e=>{e.preventDefault();ingrandisci(e.deltaY<0?1.15:1/1.15,coordinateSvgDaEvento(e));},{passive:false});
const rilascioPuntatore=e=>{
  puntatoriAttivi.delete(e.pointerId);if(puntatoriAttivi.size<2)pizzico=null;
  if(spostamentoSfondo&&!spostamentoSfondo.moved){selezione=null;pinInAttesa=null;disegnaCircuito();}
  trascinamentoPorta=null;trascinamentoNodo=null;trascinamentoLed=null;spostamentoSfondo=null;bloccoCronologia=false;
};
addEventListener('pointerup',rilascioPuntatore);
addEventListener('pointercancel',rilascioPuntatore);
$('#zin').onclick=()=>{ingrandisci(1.25,{x:areaVisibile.x+areaVisibile.w/2,y:areaVisibile.y+areaVisibile.h/2});};
$('#zout').onclick=()=>{ingrandisci(1/1.25,{x:areaVisibile.x+areaVisibile.w/2,y:areaVisibile.y+areaVisibile.h/2});};
$('#zfit').onclick=adattaAllaVista;
addEventListener('resize',aggiornaAreaVisibile);
addEventListener('orientationchange',()=>setTimeout(aggiornaAreaVisibile,200));
