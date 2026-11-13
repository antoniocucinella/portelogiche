/* =====================================================================
   js/12-parser-espressioni.js  -  PARSER: trasforma il testo in formula
   leggiEspressione() legge "A*!B+C" e costruisce un albero; calcolaEspressione() lo calcola;
   formattaEspressione() lo riscrive in forma bella; leggiCircuito() legge un circuito testuale
   tipo AND(A,NOT(B)).
   ===================================================================== */

function leggiEspressione(s){
  const c=s.toUpperCase().replace(/\s+/g,''),t=c.match(/[A-D01()!¬~*·&+|^⊕]/g)||[];
  if(!t.length||t.join('')!==c)espressioneNonValida();
  let i=0;
  const Pp=()=>{let a=Xx();while(t[i]==='+'||t[i]==='|'){i++;a={o:'|',a,b:Xx()};}return a;},
  Xx=()=>{let a=Nn();while(t[i]==='^'||t[i]==='⊕'){i++;a={o:'^',a,b:Nn()};}return a;},
  Nn=()=>{let a=Uu();while(t[i]==='*'||t[i]==='·'||t[i]==='&'){i++;a={o:'&',a,b:Uu()};}return a;},
  Uu=()=>{if(t[i]==='!'||t[i]==='¬'||t[i]==='~'){i++;return{o:'!',a:Uu()};}return Ff();},
  Ff=()=>{const q=t[i++];if(q==='('){const a=Pp();if(t[i++]!==')')espressioneNonValida();return a;}if(q>='A'&&q<='D')return{v:'ABCD'.indexOf(q),c:q};if(q==='0'||q==='1')return{k:+q};espressioneNonValida();};
  const r=Pp();if(i<t.length)espressioneNonValida();return r;
}
const calcolaEspressione=(n,v)=>n.k!==undefined?n.k:n.v!==undefined?v[n.v]:n.o==='!'?calcolaEspressione(n.a,v)^1:n.o==='&'?calcolaEspressione(n.a,v)&calcolaEspressione(n.b,v):n.o==='|'?calcolaEspressione(n.a,v)|calcolaEspressione(n.b,v):calcolaEspressione(n.a,v)^calcolaEspressione(n.b,v);
const massimaVariabile=n=>n.v!==undefined?n.v:n.k!==undefined?-1:Math.max(massimaVariabile(n.a),n.b?massimaVariabile(n.b):-1);
const SIMBOLI_OPERATORI={'&':[' · ',3],'^':[' ⊕ ',2],'|':[' + ',1]};
function formattaEspressione(n,p){
  if(n.v!==undefined)return n.c;
  if(n.k!==undefined)return''+n.k;
  if(n.o==='!')return sopralineato(formattaEspressione(n.a,0));
  const[s,q]=SIMBOLI_OPERATORI[n.o],h=formattaEspressione(n.a,q)+s+formattaEspressione(n.b,q+1);
  return q<p?'('+h+')':h;
}
const calcolaCircuitoTestuale=(n,v)=>n.v!==undefined?v[n.v]:n.g==='NOT'?PORTE.NOT.f(calcolaCircuitoTestuale(n.a[0],v)):PORTE[n.g].f(calcolaCircuitoTestuale(n.a[0],v),calcolaCircuitoTestuale(n.a[1],v));
const massimaVariabileCircuito=n=>n.v!==undefined?n.v:Math.max(...n.a.map(massimaVariabileCircuito));
function leggiCircuito(s){
  const u=s.toUpperCase().replace(/\s+/g,''),t=u.match(/[A-Z]+|[(),]/g)||[];
  if(!t.length||t.join('')!==u)throw new Error('circuito non valido');
  let i=0;
  const Nd=()=>{
    const q=t[i++];
    if(PORTE[q]){
      if(t[i++]!=='(')throw new Error('circuito non valido');
      const a=[Nd()];
      while(t[i]===','){i++;a.push(Nd());}
      if(t[i++]!==')')throw new Error('circuito non valido');
      if(a.length!==(q==='NOT'?1:2))throw new Error(q+' richiede '+(q==='NOT'?1:2)+' ingressi');
      return{g:q,a};
    }
    if(q&&q.length===1&&q>='A'&&q<='D')return{v:'ABCD'.indexOf(q),c:q};
    throw new Error('circuito non valido');
  };
  const r=Nd();if(i<t.length)throw new Error('circuito non valido');return r;
}
const SIMBOLI_PORTE={AND:[' · ',3],OR:[' + ',1],XOR:[' ⊕ ',2],NAND:[' · ',3],NOR:[' + ',1],XNOR:[' ⊕ ',2]};
function formattaCircuito(n,p){
  if(n.v!==undefined)return n.c;
  if(n.g==='NOT')return sopralineato(formattaCircuito(n.a[0],0));
  const[s,q]=SIMBOLI_PORTE[n.g],h=formattaCircuito(n.a[0],q)+s+formattaCircuito(n.a[1],q+1);
  if(n.g==='NAND'||n.g==='NOR'||n.g==='XNOR')return sopralineato(h);
  return q<p?'('+h+')':h;
}
