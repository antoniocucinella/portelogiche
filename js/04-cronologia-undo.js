/* =====================================================================
   js/04-cronologia-undo.js  -  ANNULLA / RIPETI (undo e redo)
   Ad ogni modifica si salva una "fotografia" (testo JSON) dello stato.
   annulla() torna all'ultima fotografia, ripeti() la ripristina.
   ===================================================================== */

const fotografiaStato=()=>JSON.stringify({gs:porteLavagna,ws:filiLavagna,led:posizioneLed,nid:prossimoIdPorta});
function controllaModifiche(){
  const cur=fotografiaStato();
  if(!ultimoStatoSalvato){ultimoStatoSalvato=cur;return;}
  if(cur===ultimoStatoSalvato)return;
  if(!bloccoCronologia){pilaAnnulla.push(ultimoStatoSalvato);if(pilaAnnulla.length>100)pilaAnnulla.shift();pilaRipeti=[];}
  ultimoStatoSalvato=cur;bloccoCronologia=!!(trascinamentoPorta||trascinamentoNodo||trascinamentoLed);
}
function ripristinaStato(s){
  const o=JSON.parse(s);
  porteLavagna=o.gs;filiLavagna=o.ws;posizioneLed=o.led;prossimoIdPorta=o.nid;selezione=null;pinInAttesa=null;messaggioRisultato='';trascinamentoPorta=null;trascinamentoNodo=null;trascinamentoLed=null;ultimoStatoSalvato=s;bloccoCronologia=false;
}
function annulla(){if(!pilaAnnulla.length)return;pilaRipeti.push(ultimoStatoSalvato);ripristinaStato(pilaAnnulla.pop());disegnaCircuito();}
function ripeti(){if(!pilaRipeti.length)return;pilaAnnulla.push(ultimoStatoSalvato);ripristinaStato(pilaRipeti.pop());disegnaCircuito();}
