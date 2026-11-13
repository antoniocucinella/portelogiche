/* =====================================================================
   js/17-tema.js  -  CAMBIO TEMA CHIARO / SCURO
   Il pulsante "Tema" del menu alterna chiaro e scuro e ricorda la scelta
   con la stessa chiave della home ("hub:tema"), cosi' i due restano uguali.
   Il tema iniziale e' applicato da un piccolo script nell'<head> di index.html.
   ===================================================================== */

(function(){
  const radice=document.documentElement;
  const scuroOra=()=>radice.dataset.theme?radice.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
  $('#tema').onclick=()=>{
    const nuovo=scuroOra()?'light':'dark';
    radice.dataset.theme=nuovo;
    try{localStorage.setItem('hub:tema',nuovo);}catch(e){}
  };
})();
