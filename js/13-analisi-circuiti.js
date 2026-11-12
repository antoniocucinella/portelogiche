/* =====================================================================
   js/13-analisi-circuiti.js  -  ESERCIZI DI ANALISI: "scrivi la funzione del circuito"
   disegnaAnalisi() disegna il circuito dato; verificaAnalisi() controlla la risposta dello
   studente; anteprimaRisposta()/inserisciSimbolo() gestiscono il campo di scrittura.
   ===================================================================== */

function disegnaAnalisi(){
  $('#ctar').innerHTML='<span class="mut">'+etichettaLivello(esercizioCorrente)+' · Esercizio '+(indiceEsercizio+1)+'/'+ESERCIZI.length+'</span><br>'+esercizioCorrente.t;
  $('#cth').hidden=true;$('#an').hidden=false;$('#cpal').hidden=true;
  ['#cdel','#cun','#crd'].forEach(q=>{$(q).disabled=true;});
  const T=esercizioCorrente.an,s=1.5,C=260,X0=xIngresso(numeroIngressi-1)+70;let rows=0,maxc=0;
  const wx=(d,on)=>`<path class="w${on?' on':''}" d="${d}"/>`;
  const hgt=n=>n.v!==undefined?-1:1+Math.max(...n.a.map(hgt));
  const val=n=>n.v!==undefined?valoriIngressi[n.v]:(n.val=n.g==='NOT'?PORTE.NOT.f(val(n.a[0])):PORTE[n.g].f(val(n.a[0]),val(n.a[1])));
  const place=n=>{
    if(n.v!==undefined)return;
    n.a.forEach(place);
    const gc=n.a.filter(c=>c.v===undefined);
    n.col=hgt(n);maxc=Math.max(maxc,n.col);
    n.row=gc.length?gc.reduce((t,c)=>t+c.row,0)/gc.length:rows++;
  };
  place(T);val(T);
  let wires='',gates='';
  const draw=n=>{
    if(n.v!==undefined)return;
    n.a.forEach(draw);
    const k=n.g,ow=LARGHEZZA_PORTA[k],gx=X0+n.col*C,ry=90+n.row*130,gy=ry-32*s,ix=gx+2*s,ys=k==='NOT'?[ry]:[gy+17*s,gy+47*s];
    n.ox=gx+(ow+22)*s;n.oy=ry;
    n.a.forEach((c,j)=>{
      const py=ys[j];
      if(c.v!==undefined)wires+=wx(`M${xIngresso(c.v)},${py}H${ix}`,valoriIngressi[c.v])+`<circle class="jn" cx="${xIngresso(c.v)}" cy="${py}" r="4"/>`;
      else{const xm=(c.ox+ix)/2;wires+=wx(`M${c.ox},${c.oy}H${xm}V${py}H${ix}`,c.val);}
    });
    gates+=iconaPorta(k).replace(/width="[^"]+" height="32"/,`x="${gx}" y="${gy}" width="${(ow+24)*s}" height="${64*s}"`);
  };
  draw(T);
  const yb=90+rows*130+40;let top='';
  for(let i=0;i<numeroIngressi;i++){
    const x=xIngresso(i);
    top+=`<path class="vl${valoriIngressi[i]?' on':''}" d="M${x},43V${yb}"/><g data-t="${i}"><circle cx="${x}" cy="46" r="13" class="tg${valoriIngressi[i]?' on':''}"/><text x="${x}" y="51" text-anchor="middle" class="tx">${valoriIngressi[i]}</text></g><text x="${x}" y="22" text-anchor="middle" class="tx lt">${'ABCD'[i]}</text>`;
  }
  const lxp=T.ox+100;
  const led=wx(`M${T.ox},${T.oy}H${lxp-22}`,T.val)+`<circle class="led${T.val?' on':''}" cx="${lxp}" cy="${T.oy}" r="22"/><text x="${lxp}" y="${T.oy+6}" text-anchor="middle" class="tx">Y</text>`;
  if(!analisiInizializzata){const rr=lavagna.clientHeight/lavagna.clientWidth||0.55;areaVisibile={x:0,y:0,w:Math.max(lxp+80,(yb+30)/rr),h:yb+30};analisiInizializzata=true;}
  aggiornaAreaVisibile();
  lavagna.innerHTML=top+wires+gates+led;
  $('#cres').innerHTML=messaggioRisultato;
}
function verificaAnalisi(){
  const v=$('#ans').value.trim();
  if(!v){messaggioRisultato='Scrivi la funzione nel campo Y = ...';disegnaCircuito();return;}
  let a;
  try{a=leggiEspressione(v);}catch(e){messaggioRisultato='Espressione non valida: usa A, B, C, D, ! (NOT), * (AND), + (OR), ^ (XOR) e le parentesi.';disegnaCircuito();return;}
  const N=Math.min(4,Math.max(esercizioCorrente.n,massimaVariabile(a)+1)),bad=[];
  for(let m=0;m<(1<<N);m++){
    const w=[0,1,2,3].map(i=>i<N?(m>>(N-1-i))&1:0),e=esercizioCorrente.f(...w)&1,o=calcolaEspressione(a,w)&1;
    if(e!==o)bad.push(w.slice(0,N).map((b,i)=>'ABCD'[i]+'='+b).join(' ')+' → atteso '+e+', ottenuto '+o);
  }
  if(bad.length){
    tentativiAnalisi++;
    messaggioRisultato=`<div class="rs bad">✘ Non ancora: ${bad.length} combinazioni su ${1<<N} sbagliate.<br>`+bad.slice(0,4).join('<br>')+(tentativiAnalisi>=3?'<br><button id="sol">Mostra la soluzione</button>':'')+'</div>';
  }else messaggioRisultato='<div class="rs good">✔ Corretto! La tua funzione coincide con quella del circuito per tutte le combinazioni.'+(esercizioCorrente.th?' '+esercizioCorrente.th:'')+'</div>';
  disegnaCircuito();
}
function anteprimaRisposta(){
  const v=$('#ans').value.trim();let h='';
  if(v){try{h='Y = '+formattaEspressione(leggiEspressione(v),0);}catch(e){h='<span class="mut">…</span>';}}
  $('#anp').innerHTML=h;
}
function inserisciSimbolo(k){
  const a=$('#ans'),s=a.selectionStart==null?a.value.length:a.selectionStart,e=a.selectionEnd==null?s:a.selectionEnd;
  a.value=a.value.slice(0,s)+k+a.value.slice(e);a.focus();a.setSelectionRange(s+k.length,s+k.length);anteprimaRisposta();
}
['A','B','C','D','!','*','+','^','(',')'].forEach(k=>{const b=document.createElement('button');b.textContent=k;b.onclick=()=>inserisciSimbolo(k);$('#ank').appendChild(b);});
if(matchMedia('(pointer:coarse)').matches)$('#ans').inputMode='none';
{const kb=document.createElement('button');kb.textContent='\u2328';kb.title='Mostra o nascondi la tastiera del telefono';kb.onclick=()=>{const a=$('#ans');a.inputMode=a.inputMode==='none'?'text':'none';a.focus();};$('#ank').appendChild(kb);}
$('#ans').oninput=anteprimaRisposta;
$('#ans').onkeydown=e=>{if(e.key==='Enter')verificaAnalisi();};
$('#ansx').onclick=()=>{$('#ans').value=$('#ans').value.slice(0,-1);anteprimaRisposta();};
$('#anc').onclick=()=>{$('#ans').value='';anteprimaRisposta();};
$('#cres').addEventListener('click',e=>{if(e.target.id==='sol'){messaggioRisultato='<div class="rs good">Soluzione: Y = '+formattaCircuito(esercizioCorrente.an,0)+'</div>';disegnaCircuito();}});
