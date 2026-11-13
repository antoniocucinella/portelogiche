/* =====================================================================
   js/09-pulsanti-e-verifica.js  -  PULSANTI DELLA LAVAGNA e VERIFICA
   Collega undo/redo, tastiera Ctrl+Z, tavolozza porte, elimina, svuota,
   prossimo esercizio. verificaCircuito() confronta il circuito con la funzione
   richiesta su tutte le combinazioni degli ingressi.
   ===================================================================== */

$('#cun').onclick=annulla;
$('#crd').onclick=ripeti;
addEventListener('keydown',e=>{
  if(!(e.ctrlKey||e.metaKey)||/INPUT|TEXTAREA/.test(document.activeElement.tagName)||!(document.body.classList.contains('circ')||modo3D))return;
  const k=e.key.toLowerCase();
  if(k==='z'&&!e.shiftKey){e.preventDefault();annulla();}
  else if(k==='y'||(k==='z'&&e.shiftKey)){e.preventDefault();ripeti();}
});
Object.keys(PORTE).forEach(k=>{
  const b=document.createElement('button');
  b.innerHTML=`<span>+ ${k}</span>${iconaPorta(k)}`;b.dataset.k=k;
  b.onclick=()=>{porteLavagna.push({id:prossimoIdPorta++,k,x:xIngresso(numeroIngressi-1)+60+(porteLavagna.length%3)*110,y:60+(porteLavagna.length*67)%290});messaggioRisultato='';disegnaCircuito();};
  $('#cpal').appendChild(b);
});
$('#cdel').onclick=()=>{
  if(!selezione)return;
  if(selezione.t==='w')filiLavagna.splice(selezione.i,1);
  else{const a='g'+selezione.i;porteLavagna=porteLavagna.filter(g=>g.id!==selezione.i);filiLavagna=filiLavagna.filter(w=>w.a!==a&&!w.b.startsWith(a+'.'));}
  selezione=null;messaggioRisultato='';disegnaCircuito();
};
$('#cclr').onclick=()=>{porteLavagna=[];filiLavagna=[];selezione=null;pinInAttesa=null;messaggioRisultato='';disegnaCircuito();};
$('#cnext').onclick=()=>{indiceEsercizio=(indiceEsercizio+1)%ESERCIZI.length;caricaEsercizio();};
$('#cchk').onclick=verificaCircuito;function verificaCircuito(){if(esercizioCorrente.an){verificaAnalisi();return;}
  if(!filiLavagna.some(w=>w.b==='y')){messaggioRisultato='Collega l’uscita Y a una porta o a un ingresso.';disegnaCircuito();return;}
  if(esercizioCorrente.only&&porteLavagna.some(g=>!esercizioCorrente.only.includes(g.k))){messaggioRisultato='Usa solo porte: '+esercizioCorrente.only.join(', ')+'.';disegnaCircuito();return;}
  if(esercizioCorrente.min&&porteLavagna.length<esercizioCorrente.min){messaggioRisultato='Costruisci il circuito con almeno '+esercizioCorrente.min+' porte.';disegnaCircuito();return;}
  const bad=[];
  for(let m=0;m<(1<<numeroIngressi);m++){
    const v=[0,1,2,3].map(i=>i<numeroIngressi?(m>>(numeroIngressi-1-i))&1:0),e=esercizioCorrente.f(...v)&1,o=valoreUscita(v)&1;
    if(e!==o)bad.push(v.slice(0,numeroIngressi).map((b,i)=>'ABCD'[i]+'='+b).join(' ')+' → atteso '+e+', ottenuto '+o);
  }
  messaggioRisultato=bad.length?`<div class="rs bad">✘ Non ancora: ${bad.length} combinazioni su ${1<<numeroIngressi} sbagliate.<br>`+bad.slice(0,4).join('<br>')+'</div>':'<div class="rs good">✔ Corretto! '+(esercizioCorrente.th||'Il circuito realizza la funzione per tutte le combinazioni.')+'</div>';
  disegnaCircuito();
};
