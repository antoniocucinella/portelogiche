/* =====================================================================
   js/07-azioni-e-caricamento.js  -  AZIONI SUL CIRCUITO e CARICAMENTO ESERCIZIO
   gestisciPin() collega due pin;  eseguiAzione() esegue i pulsanti del visore;
   caricaEsercizio()   carica l'esercizio scelto e azzera la lavagna.
   ===================================================================== */

function gestisciPin(id,dir){
  if(pinInAttesa&&pinInAttesa.dir!==dir){const a=dir==='i'?pinInAttesa.id:id,b=dir==='i'?id:pinInAttesa.id;filiLavagna=filiLavagna.filter(w=>w.b!==b);filiLavagna.push({a,b});pinInAttesa=null;messaggioRisultato='';}
  else pinInAttesa=(pinInAttesa&&pinInAttesa.id===id)?null:{id,dir};
  selezione=null;
}
function eseguiAzione(a){
  if(a==='del'){if(selezione&&selezione.t==='g'){const k='g'+selezione.i;porteLavagna=porteLavagna.filter(g=>g.id!==selezione.i);filiLavagna=filiLavagna.filter(w=>w.a!==k&&!w.b.startsWith(k+'.'));}selezione=null;messaggioRisultato='';}
  else if(a==='clr'){porteLavagna=[];filiLavagna=[];selezione=null;pinInAttesa=null;messaggioRisultato='';}
  else if(a==='chk')verificaCircuito();
  else{indiceEsercizio=(indiceEsercizio+(a==='nxt'?1:ESERCIZI.length-1))%ESERCIZI.length;caricaEsercizio();}
}
$('#mtog').addEventListener('click',()=>{if($('a-scene').is('vr-mode'))impostaCircuiti3D(!modo3D);else cambiaSezione(false);});
$('#c3').addEventListener('click',e=>{
  const el=e.target.closest&&e.target.closest('[data-pin],[data-g],[data-t],[data-bg],[data-add],[data-act]');
  if(!el)return;
  const d=el.dataset;
  if(d.pin)gestisciPin(d.pin,d.dir);
  else if(d.t!==undefined){valoriIngressi[+d.t]^=1;messaggioRisultato='';}
  else if(d.g!==undefined){selezione={t:'g',i:+d.g};pinInAttesa=null;}
  else if(d.add){porteLavagna.push({id:prossimoIdPorta++,k:d.add,x:xIngresso(numeroIngressi-1)+60+(porteLavagna.length%3)*110,y:75+(porteLavagna.length*67)%270});messaggioRisultato='';}
  else if(d.act)eseguiAzione(d.act);
  else if(d.bg){
    const it=e.detail&&e.detail.intersection;
    if(it&&selezione&&selezione.t==='g'){
      const g=porteLavagna.find(g=>g.id===selezione.i);
      if(g){g.x=Math.max(xIngresso(numeroIngressi-1)+35,Math.min(560,it.point.x/SCALA_3D+360));g.y=Math.max(75,Math.min(345,(1.4-it.point.y)/SCALA_3D+190));}
    }else{selezione=null;pinInAttesa=null;}
  }
  disegnaCircuito();
});
function caricaEsercizio(){esercizioCorrente=ESERCIZI[indiceEsercizio];$('#csel').value=indiceEsercizio;posizioneLed={x:730,y:220};areaVisibile={x:0,y:0,w:innerWidth<700?460:800,h:440};numeroIngressi=esercizioCorrente.n;valoriIngressi=[0,0,0,0];porteLavagna=[];filiLavagna=[];selezione=null;pinInAttesa=null;messaggioRisultato='';pilaAnnulla=[];pilaRipeti=[];ultimoStatoSalvato=fotografiaStato();bloccoCronologia=false;tentativiAnalisi=0;analisiInizializzata=false;$('#ans').value='';$('#anp').innerHTML='';disegnaCircuito();}
