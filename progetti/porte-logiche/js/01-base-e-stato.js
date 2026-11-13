/* =====================================================================
   js/01-base-e-stato.js  -  BASE: scorciatoie, porte e stato della "Porta singola"
   $        = scorciatoia per document.querySelector (cerca un elemento)
   PORTE    = tabella delle 7 porte: numero ingressi (n), funzione (f) e
              formula da mostrare (expr)
   portaScelta, A, B = porta scelta e valori dei due ingressi (0 oppure 1)
   coloraOggetto3D / impostaTesto3D = aiutanti per colorare un oggetto 3D e cambiarne il testo
   adattaTelecamera / posizionaTelecamera = posizione della telecamera 3D
   ===================================================================== */

const $=s=>document.querySelector(s);
const PORTE={
  AND:{n:2,f:(a,b)=>a&b,expr:"Y = A · B"},
  OR:{n:2,f:(a,b)=>a|b,expr:"Y = A + B"},
  NOT:{n:1,f:a=>a^1,expr:"Y = <span class='ov'>A</span>"},
  NAND:{n:2,f:(a,b)=>(a&b)^1,expr:"Y = <span class='ov'>A · B</span>"},
  NOR:{n:2,f:(a,b)=>(a|b)^1,expr:"Y = <span class='ov'>A + B</span>"},
  XOR:{n:2,f:(a,b)=>a^b,expr:"Y = A ⊕ B"},
  XNOR:{n:2,f:(a,b)=>(a^b)^1,expr:"Y = <span class='ov'>A ⊕ B</span>"}
};
let portaScelta='AND',A=0,B=0,modalitaPrevisione=false,ipotesi=[],verificato=false,contatoreAggiornamenti=0;

function coloraOggetto3D(el,on,col,off){
  el.setAttribute('material',{color:on?col:off,emissive:on?col:'#000000',emissiveIntensity:on?0.8:0});
}
function impostaTesto3D(sel,t){$(sel).setAttribute('label','text',t);}
function adattaTelecamera(){if($('a-scene').is('vr-mode'))return;posizionaTelecamera();}
function posizionaTelecamera(){$('#rig').setAttribute('position',{x:1.6,y:1.8,z:innerWidth<innerHeight?6.2:2.2});$('#rig').setAttribute('rotation',{x:-9,y:14.5,z:0});}
