/* =====================================================================
   js/14-esercizi-personalizzati.js  -  ESERCIZI DA FILE E DA EDITOR DOCENTE
   creaEsercizio() trasforma una voce del file JSON in esercizio;
   applicaEsercizi() ricostruisce l'elenco; il resto e' l'editor docente.
   ===================================================================== */

function creaEsercizio(e,g){
  if(e.circuito){
    const T=leggiCircuito(e.circuito);
    return{cu:1,l:String(g),n:Math.min(4,massimaVariabileCircuito(T)+1),t:(e.titolo?escapeHtml(e.titolo)+' — ':'')+'Dato il circuito, scrivi la funzione logica Y',f:(...v)=>calcolaCircuitoTestuale(T,v),an:T,th:e.teoria?escapeHtml(e.teoria):undefined};
  }
  let n,f,t;
  if(e.tabella){
    const b=String(e.tabella).replace(/[^01]/g,'');n=Math.log2(b.length);
    if(!Number.isInteger(n)||n<1||n>4)throw new Error('la tabella deve avere 2, 4, 8 o 16 uscite');
    f=(...v)=>+b[v.slice(0,n).reduce((s,x,i)=>s|x<<(n-1-i),0)];
    t='Y secondo la tabella ('+'ABCD'.slice(0,n)+' da '+'0'.repeat(n)+' a '+'1'.repeat(n)+'): '+b;
  }else{
    const a=leggiEspressione(e.espressione||'');
    n=Math.min(4,Math.max(massimaVariabile(a)+1,+e.variabili||0,1));
    f=(...v)=>calcolaEspressione(a,v);t='Y = '+formattaEspressione(a,0);
  }
  if(e.titolo)t=escapeHtml(e.titolo)+' — '+t;
  return{cu:1,l:String(g),n,t,f,only:e.porte&&e.porte.length?e.porte:undefined,min:e.min||undefined,th:e.teoria?escapeHtml(e.teoria):undefined};
}
function applicaEsercizi(){
  const src=eserciziLocali||eserciziDaFile,bad=[];
  ESERCIZI.length=0;if(!src.length)ESERCIZI.push(...ESERCIZI_INIZIALI);
  src.forEach(g=>(g.esercizi||[]).forEach(e=>{try{ESERCIZI.push(creaEsercizio(e,g.nome||'Esercizi'));}catch(err){bad.push(err.message);}}));
  if(!ESERCIZI.length)ESERCIZI.push(...ESERCIZI_INIZIALI);
  if(indiceEsercizio>=ESERCIZI.length)indiceEsercizio=0;
  riempiMenuEsercizi();caricaEsercizio();
  return bad;
}
function modificaEserciziLocali(){if(!eserciziLocali)eserciziLocali=JSON.parse(JSON.stringify(eserciziDaFile));return eserciziLocali;}
function disegnaEditorDocente(b){
  const L=eserciziLocali||eserciziDaFile;
  $('#es').textContent=b&&b.length?'Attenzione: '+b.join('; '):'';
  $('#egl').innerHTML=L.map(g=>`<option value="${escapeHtml(g.nome)}">`).join('');
  $('#el').innerHTML=L.map((g,gi)=>`<b>${escapeHtml(g.nome)}</b>`+(g.esercizi||[]).map((e,i)=>`<div><button data-g="${gi}" data-i="${i}">✕</button><span>${escapeHtml((e.titolo?e.titolo+' — ':'')+(e.espressione||e.tabella||e.circuito||''))}</span></div>`).join('')).join('')||'<span class="mut">Nessun esercizio personalizzato.</span>';
  $('#ej').value=JSON.stringify({gruppi:L},null,1);
}
function salvaEserciziLocali(){try{localStorage.setItem('esercizi_locali',JSON.stringify(eserciziLocali));}catch(e){}disegnaEditorDocente(applicaEsercizi());}
$('#ep').innerHTML='<span class="mut">Porte consentite (nessuna = tutte):</span> '+Object.keys(PORTE).map(k=>`<label><input type="checkbox" value="${k}"> ${k}</label>`).join(' ');
$('#ced').hidden=!MODALITA_DOCENTE;
$('#ced').onclick=()=>{$('#ed').hidden=false;disegnaEditorDocente();};
$('#ec').onclick=()=>{$('#ed').hidden=true;};
$('#ea').onclick=()=>{
  const e={},g=$('#eg').value.trim()||'Miei esercizi';
  if($('#et').value.trim())e.titolo=$('#et').value.trim();
  if($('#ecc').value.trim())e.circuito=$('#ecc').value.trim();
  else if($('#ex').value.trim())e.tabella=$('#ex').value.trim();else e.espressione=$('#ee').value.trim();
  const p=[...document.querySelectorAll('#ep input:checked')].map(c=>c.value);
  if(p.length&&p.length<Object.keys(PORTE).length)e.porte=p;
  if(+$('#em').value>0)e.min=+$('#em').value;
  if($('#eh').value.trim())e.teoria=$('#eh').value.trim();
  try{creaEsercizio(e,g);}catch(err){$('#es').textContent='Errore: '+err.message;return;}
  const L=modificaEserciziLocali();let gr=L.find(x=>x.nome===g);
  if(!gr){gr={nome:g,esercizi:[]};L.push(gr);}
  gr.esercizi.push(e);
  $('#ee').value='';$('#ex').value='';$('#ecc').value='';$('#et').value='';$('#eh').value='';
  salvaEserciziLocali();
};
$('#el').addEventListener('click',e=>{
  const b=e.target.closest('button[data-g]');if(!b)return;
  const L=modificaEserciziLocali(),g=L[+b.dataset.g];
  g.esercizi.splice(+b.dataset.i,1);
  if(!g.esercizi.length)L.splice(+b.dataset.g,1);
  salvaEserciziLocali();
});
$('#er').onclick=()=>{eserciziLocali=null;try{localStorage.removeItem('esercizi_locali');}catch(e){}disegnaEditorDocente(applicaEsercizi());};
$('#ei').onclick=()=>{
  try{const j=JSON.parse($('#ej').value);eserciziLocali=Array.isArray(j)?j:j.gruppi;if(!Array.isArray(eserciziLocali))throw 0;salvaEserciziLocali();}
  catch(e){$('#es').textContent='JSON non valido.';}
};
$('#ed2').onclick=()=>{
  const b=new Blob([JSON.stringify({gruppi:eserciziLocali||eserciziDaFile},null,1)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='esercizi.json';a.click();
};
if(eserciziLocali)applicaEsercizi();
