/* =====================================================================
   js/16-menu-e-avvio.js  -  MENU, AIUTO E AVVIO DEL PROGRAMMA
   Mostra/nasconde il menu, apre l'aiuto, carica data/esercizi.json e
   avvia avviaProgramma() appena A-Frame e' pronto.
   ===================================================================== */

function mostraNascondiMenu(h,p){document.body.classList.toggle('mh',h);aggiornaLinguetta(h);if(p){try{localStorage.setItem('menu',h?'0':'1');}catch(e){}}}
// La linguetta #mx e' una sola: nasconde il menu se e' aperto, lo mostra se e' chiuso
function aggiornaLinguetta(h){const t=$('#mx');const e=h?'Mostra il menu':'Nascondi il menu';t.title=e;t.setAttribute('aria-label',e);t.setAttribute('aria-expanded',String(!h));}
try{if(localStorage.getItem('menu')==='0')mostraNascondiMenu(true);}catch(e){}
$('#mx').onclick=()=>mostraNascondiMenu(!document.body.classList.contains('mh'),true);
$('#mC').addEventListener('click',()=>mostraNascondiMenu(true));
$('#mS').addEventListener('click',()=>mostraNascondiMenu(false));
$('#hbtn').onclick=()=>{$('#hlp').hidden=false;disegnaAiuto();};
$('#hx').onclick=()=>{$('#hlp').hidden=true;};
$('#hsvg').addEventListener('pointerdown',e=>{const g=e.target.closest('[data-hv]');if(!g)return;ingressiAiuto[g.dataset.hv]^=1;disegnaAiuto();});
addEventListener('keydown',e=>{if(e.key==='Escape')$('#hlp').hidden=true;});
fetch('data/esercizi.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&Array.isArray(j.gruppi)){eserciziDaFile=j.gruppi;applicaEsercizi();if(MODALITA_DOCENTE)disegnaEditorDocente();}}).catch(()=>{});

const scenaAFrame=$('a-scene');
if(!window.AFRAME){document.body.insertAdjacentHTML('beforeend','<div class="ui" style="bottom:8px;left:8px">Impossibile caricare A-Frame: controlla la connessione.</div>');}
else{if(scenaAFrame.hasLoaded)avviaProgramma();else scenaAFrame.addEventListener('loaded',avviaProgramma);setTimeout(avviaProgramma,2000);}
