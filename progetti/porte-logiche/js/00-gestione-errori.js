/* =====================================================================
   00-gestione-errori.js  -  MOSTRA GLI ERRORI A SCHERMO
   Se il programma ha un errore JavaScript, compare un riquadro rosso
   in basso con il messaggio: utile in classe e sul telefono, dove non
   si apre la console. Un clic sul riquadro lo chiude.
   Va caricato per PRIMO, prima di tutti gli altri script.
   ===================================================================== */

addEventListener('error',function(e){try{var d=document.getElementById('errbox');if(!d){d=document.createElement('pre');d.id='errbox';d.style.cssText='position:fixed;z-index:99;left:8px;bottom:8px;right:8px;max-height:30vh;overflow:auto;margin:0;padding:8px;background:#7f1d1d;color:#fff;font:12px monospace;border-radius:8px;white-space:pre-wrap';d.onclick=function(){d.remove();};document.body.appendChild(d);}d.textContent+=(e.message||'errore')+(e.filename?'\n  '+e.filename+':'+e.lineno+':'+e.colno:'')+(e.error&&e.error.stack?'\n'+e.error.stack.split('\n').slice(0,4).join('\n'):'')+'\n';}catch(_){}});
