/* =====================================================================
   js/15-aiuto-circuiti-elettrici.js  -  FINESTRA AIUTO: porte logiche = circuiti elettrici
   Mostra, con interruttori e lampadina, come ogni porta corrisponde a
   un circuito: serie = AND, parallelo = OR, contatto NC = NOT.
   ===================================================================== */

/* ===== Aiuto: equivalenza con i circuiti elettrici ===== */
let portaAiuto='AND',ingressiAiuto={A:0,B:0};
const contatto=(v,n)=>({v,n}),serie=(...c)=>({t:'s',c}),parallelo=(...c)=>({t:'p',c});
const CIRCUITI_ELETTRICI={AND:serie(contatto('A'),contatto('B')),OR:parallelo(contatto('A'),contatto('B')),NOT:serie(contatto('A',1)),NAND:parallelo(contatto('A',1),contatto('B',1)),NOR:serie(contatto('A',1),contatto('B',1)),XOR:parallelo(serie(contatto('A'),contatto('B',1)),serie(contatto('A',1),contatto('B'))),XNOR:parallelo(serie(contatto('A'),contatto('B')),serie(contatto('A',1),contatto('B',1)))};
const SPIEGAZIONI_AIUTO={
  AND:'<b>AND = interruttori in serie.</b> La corrente passa solo se A e B sono premuti insieme: se uno dei due è aperto il circuito è interrotto.',
  OR:'<b>OR = interruttori in parallelo.</b> Basta che uno dei due sia premuto: la corrente trova comunque una strada.',
  NOT:'<b>NOT = contatto normalmente chiuso (NC).</b> A riposo la corrente passa; premendo A il contatto si apre e la lampadina si spegne.',
  NAND:'<b>NAND = due contatti NC in parallelo.</b> La lampadina si spegne solo quando A e B sono premuti insieme. È il teorema di De Morgan: la negazione di un prodotto è la somma delle negazioni.',
  NOR:'<b>NOR = due contatti NC in serie.</b> La lampadina si accende solo se né A né B sono premuti. De Morgan: la negazione di una somma è il prodotto delle negazioni.',
  XOR:'<b>XOR = due rami in parallelo</b>, ognuno con un contatto NO e uno NC. Si accende se A e B sono diversi. È il circuito dei deviatori delle scale, con due punti di comando per la stessa lampada.',
  XNOR:'<b>XNOR = due rami in parallelo:</b> A e B premuti insieme, oppure nessuno dei due. Si accende se A e B sono uguali.'
};
function dimensioniCircuito(n){
  if(n.v)return{w:90,h:56};
  const k=n.c.map(dimensioniCircuito);
  return n.t==='s'?{w:k.reduce((s,a)=>s+a.w,0),h:Math.max(...k.map(a=>a.h))}:{w:Math.max(...k.map(a=>a.w))+40,h:k.reduce((s,a)=>s+a.h,0)};
}
const disegnaFilo=(d,on)=>`<path class="w${on?' on':''}" d="${d}"/>`;
function disegnaCircuitoElettrico(n,x,y,on){
  if(n.v){
    const cond=(ingressiAiuto[n.v]^(n.n?1:0))===1,out=on&&cond,x1=x+25,x2=x+65;
    const lever=cond?`M${x1},${y}H${x2}`:`M${x1},${y}L${x2-5},${y-24}`;
    return{o:out,s:disegnaFilo(`M${x},${y}H${x1}`,on)+disegnaFilo(`M${x2},${y}H${x+90}`,out)+`<g data-hv="${n.v}" style="cursor:pointer"><path class="ln" d="${lever}"/><circle cx="${x1}" cy="${y}" r="4" class="hd"/><circle cx="${x2}" cy="${y}" r="4" class="hd"/><rect x="${x}" y="${y-30}" width="90" height="60" fill="transparent"/><text x="${x+45}" y="${y+26}" text-anchor="middle" class="tx">${n.v}${n.n?' (NC)':''}</text></g>`};
  }
  if(n.t==='s'){
    let s='',cx=x,o=on;
    n.c.forEach(c=>{const r=disegnaCircuitoElettrico(c,cx,y,o);s+=r.s;o=r.o;cx+=dimensioniCircuito(c).w;});
    return{o,s};
  }
  const k=n.c.map(dimensioniCircuito),H=k.reduce((a,b)=>a+b.h,0),W=dimensioniCircuito(n).w,ys=[],oo=[];
  let s='',cy=y-H/2;
  n.c.forEach((c,i)=>{
    const yy=cy+k[i].h/2;ys.push(yy);cy+=k[i].h;
    const r=disegnaCircuitoElettrico(c,x+20,yy,on);s+=r.s;oo.push(r.o);
    s+=disegnaFilo(`M${x+20+k[i].w},${yy}H${x+W-20}`,r.o);
  });
  const o=oo.some(Boolean);
  s+=disegnaFilo(`M${x},${y}H${x+20}`,on)+disegnaFilo(`M${x+20},${ys[0]}V${ys[ys.length-1]}`,on)+disegnaFilo(`M${x+W-20},${ys[0]}V${ys[ys.length-1]}`,o)+disegnaFilo(`M${x+W-20},${y}H${x+W}`,o);
  return{o,s};
}
function disegnaAiuto(){
  const c=CIRCUITI_ELETTRICI[portaAiuto],z=dimensioniCircuito(c),cy=z.h/2+40,x0=110,xl=40,xr=x0+z.w+60,yb=cy+z.h/2+70,ym=(cy+yb)/2,W=xr+90,Hh=yb+40;
  const r=disegnaCircuitoElettrico(c,x0,cy,true),lit=r.o;
  let s=disegnaFilo(`M${xl},${cy}H${x0}`,true)+r.s+disegnaFilo(`M${xl},${cy}V${ym-6}`,true)+disegnaFilo(`M${xl},${ym+6}V${yb}H${xr}V${ym+20}`,lit)+`<path class="ln" d="M${xl-18},${ym-6}H${xl+18}M${xl-9},${ym+6}H${xl+9}"/><text x="${xl+24}" y="${ym-2}" class="tx">+</text><text x="${xl+24}" y="${ym+14}" class="tx">−</text>`;
  s+=disegnaFilo(`M${x0+z.w},${cy}H${xr}V${ym-20}`,lit);
  s+=`<circle cx="${xr}" cy="${ym}" r="20" class="lamp${lit?' on':''}"/><path class="ln" d="M${xr-14},${ym-14}L${xr+14},${ym+14}M${xr+14},${ym-14}L${xr-14},${ym+14}"/>`;
  
  s+=`<text x="${xr+28}" y="${ym+5}" class="tx">Y = ${lit?1:0}</text>`;
  const sv=$('#hsvg');sv.setAttribute('viewBox',`0 0 ${W} ${Hh}`);sv.innerHTML=s;
  document.querySelectorAll('#htabs button').forEach(b=>b.classList.toggle('on',b.dataset.k===portaAiuto));
  $('#htxt').innerHTML=SPIEGAZIONI_AIUTO[portaAiuto];
  $('#hex').innerHTML=PORTE[portaAiuto].expr;
  const one=portaAiuto==='NOT',rows=one?[[0],[1]]:[[0,0],[0,1],[1,0],[1,1]];
  let t='<tr><th>A</th>'+(one?'':'<th>B</th>')+'<th>Y</th></tr>';
  rows.forEach(q=>{const cur=q[0]==ingressiAiuto.A&&(one||q[1]==ingressiAiuto.B);t+=`<tr class="${cur?'cur':''}"><td>${q[0]}</td>${one?'':`<td>${q[1]}</td>`}<td>${PORTE[portaAiuto].f(q[0],q[1]||0)}</td></tr>`;});
  $('#htt').innerHTML=t;
}
Object.keys(PORTE).forEach(k=>{
  const b=document.createElement('button');
  b.dataset.k=k;b.innerHTML=`<span>${k}</span>${iconaPorta(k)}`;
  b.onclick=()=>{portaAiuto=k;disegnaAiuto();};
  $('#htabs').appendChild(b);
});
