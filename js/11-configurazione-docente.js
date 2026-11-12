/* =====================================================================
   js/11-configurazione-docente.js  -  MODALITA' DOCENTE - configurazione
   La modalita' docente si attiva aprendo la pagina con  #docente  alla
   fine dell'indirizzo. Gli esercizi personali stanno nel localStorage.
   ===================================================================== */

/* ===== Esercizi personalizzabili ===== */
const MODALITA_DOCENTE=location.hash==='#docente';
try{localStorage.removeItem('docente');}catch(e){}
addEventListener('hashchange',()=>location.reload());
let eserciziDaFile=[],eserciziLocali=null;const ESERCIZI_INIZIALI=ESERCIZI.slice();
try{if(MODALITA_DOCENTE)eserciziLocali=JSON.parse(localStorage.getItem('esercizi_locali')||'null');}catch(e){}
const escapeHtml=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const espressioneNonValida=()=>{throw new Error('espressione non valida');};
