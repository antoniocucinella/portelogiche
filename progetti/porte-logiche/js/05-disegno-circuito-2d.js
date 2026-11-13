/* =====================================================================
   js/05-disegno-circuito-2d.js  -  DISEGNO DEL CIRCUITO SULLA LAVAGNA (SVG)
   posizionePin()   dove si trova un punto di collegamento (pin)
   valoreSegnale()   valore logico (0/1) di un segnale, calcolato ricorsivamente
   disegnaPorta()  disegna una porta;  iconaPorta() disegna l'icona di una porta
   disegnaCircuito()    "circuito render": ridisegna l'intera lavagna
   ===================================================================== */

const xIngresso=i=>40+i*45;
const lavagna=$('#cw');
function posizionePin(id){
  if(id==='y')return[posizioneLed.x-40,posizioneLed.y];
  if(id[0]==='i')return[xIngresso(+id.slice(1)),30];
  const[a,p]=id.split('.'),g=porteLavagna.find(g=>'g'+g.id===a);
  return p===undefined?[g.x+LARGHEZZA_PORTA[g.k]+10,g.y+30]:[g.x-10,g.y+(g.k==='NOT'?30:15+30*p)];
}
function valoreSegnale(a,v,seen=[]){
  if(a[0]==='i')return v[+a.slice(1)];
  if(seen.includes(a))return 0;
  const g=porteLavagna.find(g=>'g'+g.id===a);if(!g)return 0;
  const x=(g.k==='NOT'?[0]:[0,1]).map(p=>{const w=filiLavagna.find(w=>w.b===a+'.'+p);return w?valoreSegnale(w.a,v,seen.concat(a)):0;});
  return PORTE[g.k].f(...x);
}
const valoreUscita=v=>{const w=filiLavagna.find(w=>w.b==='y');return w?valoreSegnale(w.a,v):0;};
function disegnaPin(id,dir,x,y){return `<rect class="pd${pinInAttesa&&pinInAttesa.id===id?' sel':''}" x="${x-3.5}" y="${y-3.5}" width="7" height="7"/><circle class="ph" data-pin="${id}" data-dir="${dir}" cx="${x}" cy="${y}" r="11"/>`;}
function disegnaPorta(g){
  const k=g.k,bub=/^(NAND|NOR|XNOR|NOT)$/.test(k),b=k==='NOT'?'NOT':k==='XNOR'?'XOR':k.replace(/^N/,''),xo=b==='XOR',d=FORMA_PORTA[xo?'OR':b],ys=k==='NOT'?[30]:[15,45],ow=LARGHEZZA_PORTA[k];
  let s=`<g data-g="${g.id}" transform="translate(${g.x},${g.y})"${selezione&&selezione.t==='g'&&selezione.i===g.id?' class="gs"':''}>`;
  s+=`<path class="ln" d="${ys.map(y=>`M-10,${y}H16`).join('')}M${ow},30H${ow+10}"/>`;
  s+=`<path class="gb"${xo?' transform="translate(8,0)"':''} d="${d}"/>`;
  if(xo)s+='<path class="ln" d="M0,0Q20,30 0,60"/>';
  if(bub)s+=`<circle class="gb" cx="${ow-5}" cy="30" r="5"/>`;
  s+=`<text class="gn" x="${ow/2}" y="78" text-anchor="middle">${k}</text>`;
  ys.forEach((y,p)=>s+=disegnaPin(`g${g.id}.${p}`,'i',-10,y));
  return s+disegnaPin('g'+g.id,'o',ow+10,30)+'</g>';
}
function iconaPorta(k){
  const bub=/^(NAND|NOR|XNOR|NOT)$/.test(k),b=k==='NOT'?'NOT':k==='XNOR'?'XOR':k.replace(/^N/,''),xo=b==='XOR',ys=k==='NOT'?[30]:[15,45],ow=LARGHEZZA_PORTA[k];
  return `<svg viewBox="-12 -2 ${ow+24} 64" width="${(ow+24)*0.5}" height="32">`+
    `<path class="ln" d="${ys.map(y=>`M-10,${y}H16`).join('')}M${ow},30H${ow+10}"/>`+
    `<path class="gb"${xo?' transform="translate(8,0)"':''} d="${FORMA_PORTA[xo?'OR':b]}"/>`+
    (xo?'<path class="ln" d="M0,0Q20,30 0,60"/>':'')+
    (bub?`<circle class="gb" cx="${ow-5}" cy="30" r="5"/>`:'')+'</svg>';
}
function disegnaCircuito(){controllaModifiche();if(esercizioCorrente.an){disegnaAnalisi();return;}$('#an').hidden=true;$('#cpal').hidden=false;
  $('#ctar').innerHTML='<span class="mut">'+etichettaLivello(esercizioCorrente)+' · Esercizio '+(indiceEsercizio+1)+'/'+ESERCIZI.length+'</span><span class="fn">Realizza: '+esercizioCorrente.t+'</span>';$('#cth').innerHTML=esercizioCorrente.th||'';$('#cth').hidden=!esercizioCorrente.th;document.querySelectorAll('#cpal button').forEach(b=>b.disabled=!!esercizioCorrente.only&&!esercizioCorrente.only.includes(b.dataset.k));
  let s='';
  let H='';
  filiLavagna.forEach((w,i)=>{
    const V=puntiDelFilo(w),d='M'+V.map(q=>q[0]+','+q[1]).join('L'),inp=w.a[0]==='i',on=selezione&&selezione.t==='w'&&selezione.i===i;
    s+=`<path class="w${valoreSegnale(w.a,valoriIngressi)?' on':''}${on?' sel':''}" d="${d}"/><path class="hit" data-w="${i}" d="${d}"/>${inp?`<circle class="jn" cx="${V[0][0]}" cy="${V[0][1]}" r="4"/>`:''}`;
    if(on){
      for(let k=0;k<V.length-1;k++)H+=`<circle class="mp" data-mp="${i}:${k}" cx="${(V[k][0]+V[k+1][0])/2}" cy="${(V[k][1]+V[k+1][1])/2}" r="6"/>`;
      for(let k=1;k<V.length-1;k++)H+=`<circle class="nd" data-nd="${i}:${k-1}" cx="${V[k][0]}" cy="${V[k][1]}" r="8"/>`;
    }
  });
  porteLavagna.forEach(g=>s+=disegnaPorta(g));
  for(let i=0;i<numeroIngressi;i++){
    const x=xIngresso(i);
    s+=`<path class="vl${pinInAttesa&&pinInAttesa.id==='i'+i?' sel':''}${valoriIngressi[i]?' on':''}" d="M${x},43V1500"/><path class="hit" data-pin="i${i}" data-dir="o" d="M${x},43V1500"/><g data-t="${i}"><circle cx="${x}" cy="46" r="13" class="tg${valoriIngressi[i]?' on':''}"/><text x="${x}" y="51" text-anchor="middle" class="tx">${valoriIngressi[i]}</text></g><text x="${x}" y="22" text-anchor="middle" class="tx lt">${'ABCD'[i]}</text>`;
  }
  s+=disegnaPin('y','i',posizioneLed.x-40,posizioneLed.y)+`<path class="ln" d="M${posizioneLed.x-32},${posizioneLed.y}H${posizioneLed.x-20}"/><g data-led="1" style="cursor:move"><circle class="led${valoreUscita(valoriIngressi)?' on':''}" cx="${posizioneLed.x}" cy="${posizioneLed.y}" r="20"/><text x="${posizioneLed.x}" y="${posizioneLed.y+6}" text-anchor="middle" class="tx">Y</text></g>`;
  lavagna.innerHTML=s+H;aggiornaAreaVisibile();
  $('#cres').innerHTML=messaggioRisultato;$('#cdel').disabled=!selezione;$('#cun').disabled=!pilaAnnulla.length;$('#crd').disabled=!pilaRipeti.length;if(modo3D)disegnaCircuito3D();
}
