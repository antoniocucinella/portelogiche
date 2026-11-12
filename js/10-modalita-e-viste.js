/* =====================================================================
   js/10-modalita-e-viste.js  -  CAMBIO MODALITA' e VISTE (2D / 3D)
   cambiaSezione() passa da Porta singola a Circuiti;  cambiaVista() da 2D a 3D;
   disegnaVista2D() disegna la vista 2D della porta singola.
   ===================================================================== */

function esciDaCircuiti3D(){document.body.classList.remove('c3on');if(modo3D)impostaCircuiti3D(false);if(!$('a-scene').is('vr-mode')){$('#vrui').setAttribute('visible',false);posizionaTelecamera();}}
function entraInCircuiti3D(){document.body.classList.add('c3on');$('#vrui').setAttribute('visible',true);impostaCircuiti3D(true);$('#rig').setAttribute('position',{x:0,y:1.4,z:innerWidth<innerHeight?2.9:-1.2});$('#rig').setAttribute('rotation',{x:0,y:0,z:0});}
function cambiaSezione(c){esciDaCircuiti3D();document.body.classList.toggle('circ',c);$('#mS').classList.toggle('on',!c);$('#mC').classList.toggle('on',c);if(c)disegnaCircuito();}
function disegnaVista2D(){
  const k=portaScelta,one=k==='NOT',y=PORTE[k].f(A,B),s=3,x0=250,y0=90,ow=LARGHEZZA_PORTA[k],pi=one?[y0+96]:[y0+51,y0+141],xi=x0+6,xo=x0+(ow+22)*s,yo=y0+96;
  const sw=(i,v,yy)=>`<g data-s="${i}" style="cursor:pointer"><rect x="24" y="${yy-24}" width="92" height="48" rx="12" class="tg${v?' on':''}"/><text x="70" y="${yy+7}" text-anchor="middle" class="tx" style="font-size:20px">${'AB'[i]} = ${v}</text></g>`;
  let h=`<path class="w${A?' on':''}" d="M116,${pi[0]}H${xi}"/>`+sw(0,A,pi[0]);
  if(!one)h+=`<path class="w${B?' on':''}" d="M116,${pi[1]}H${xi}"/>`+sw(1,B,pi[1]);
  h+=iconaPorta(k).replace(/width="[^"]+" height="32"/,`x="${x0}" y="${y0}" width="${(ow+24)*s}" height="${64*s}"`);
  h+=`<path class="w${y?' on':''}" d="M${xo},${yo}H${xo+50}"/><circle class="led${y?' on':''}" cx="${xo+78}" cy="${yo}" r="28"/><text class="tx" x="${xo+78}" y="${yo+7}" text-anchor="middle" style="font-size:20px">Y</text><text class="tx" x="${xo+78}" y="${yo+64}" text-anchor="middle" style="font-size:20px">Y = ${y}</text>`;
  h+=`<text class="tx" x="${x0+(ow+24)*s/2}" y="${y0+64*s+34}" text-anchor="middle" style="font-size:26px">${k}</text>`;
  $('#s2v').innerHTML=h;
}
function cambiaVista(v){document.body.classList.toggle('v2',v);if(v){esciDaCircuiti3D();const S=$('a-scene'),xr=S.renderer&&S.renderer.xr&&S.renderer.xr.isPresenting;if(S.is&&S.is('vr-mode')&&!xr){try{S.exitVR();}catch(e){}}disegnaVista2D();}else if(document.body.classList.contains('circ'))entraInCircuiti3D();}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.a-enter-vr-button'))cambiaVista(false);},true);
addEventListener('keydown',e=>{if(e.key==='Escape')cambiaVista(true);});
if(/OculusBrowser|Quest/i.test(navigator.userAgent))cambiaVista(false);
$('#s2v').addEventListener('pointerdown',e=>{
  const g=e.target.closest('[data-s]');
  if(!g)return;
  if(g.dataset.s==='0')A^=1;else B^=1;
  aggiornaPortaSingola();
});
$('#mS').onclick=()=>cambiaSezione(false);
$('#b3d').onclick=()=>cambiaVista(false);
$('#b2d').onclick=()=>cambiaVista(true);
try{if(navigator.xr&&navigator.xr.isSessionSupported)navigator.xr.isSessionSupported('immersive-vr').then(ok=>{if(ok)document.body.classList.add('xr-ok');}).catch(()=>{});}catch(e){}
$('#mC').onclick=()=>cambiaSezione(true);
function riempiMenuEsercizi(){const s=$('#csel');s.innerHTML='';ESERCIZI.forEach((e,i)=>{const op=document.createElement('option');op.value=i;op.textContent=(i+1)+' · '+etichettaLivello(e);s.appendChild(op);});s.value=indiceEsercizio;}
riempiMenuEsercizi();
$('#csel').onchange=e=>{indiceEsercizio=+e.target.value;caricaEsercizio();};
caricaEsercizio();
