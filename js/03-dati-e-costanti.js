/* =====================================================================
   js/03-dati-e-costanti.js  -  SEZIONE CIRCUITI - dati e variabili di stato
   ESERCIZI = elenco degli esercizi (livello, ingressi n, testo t, funzione f)
   LARGHEZZA_PORTA = larghezza di ogni porta;  FORMA_PORTA = forma SVG del corpo della porta
   GLOSSARIO delle variabili usate nella lavagna:
     indiceEsercizio = numero esercizio corrente
     esercizioCorrente = esercizio corrente (oggetto)
     numeroIngressi = quanti ingressi
     valoriIngressi = valori degli ingressi [A,B,C,D]
     porteLavagna = porte sulla lavagna
     filiLavagna  = fili sulla lavagna
     selezione = elemento selezionato
     pinInAttesa = pin gia' toccato in attesa del secondo
     areaVisibile = parte visibile della lavagna (zoom/spostamento)
     posizioneLed = posizione del LED di uscita Y
   ===================================================================== */

/* ===== Sezione Circuiti ===== */
const ESERCIZI_BASE=[
 {t:'Y = A · <span class="ov">B</span>',n:2,f:(a,b)=>a&(b^1)},
 {t:'Y = <span class="ov">A</span> + B',n:2,f:(a,b)=>(a^1)|b},
 {t:'Y = A · B + C',n:3,f:(a,b,c)=>(a&b)|c},
 {t:'Y = (A + B) · C',n:3,f:(a,b,c)=>(a|b)&c},
 {t:'Y = A · B + <span class="ov">A</span> · C (multiplexer)',n:3,f:(a,b,c)=>(a&b)|((a^1)&c)},
 {t:'Y = A ⊕ B ⊕ C (parità)',n:3,f:(a,b,c)=>a^b^c},
 {t:'Y = A · B + B · C + A · C (maggioranza)',n:3,f:(a,b,c)=>(a&b)|(b&c)|(a&c)},
 {t:'Y = A · <span class="ov">B</span> · C + C · <span class="ov">D</span> + <span class="ov">A</span> · B · <span class="ov">C</span> · D',n:4,f:(a,b,c,d)=>(a&(b^1)&c)|(c&(d^1))|((a^1)&b&(c^1)&d)}
];
const sopralineato=s=>`<span class="ov">${s}</span>`,BASE=ESERCIZI_BASE,etichettaLivello=e=>typeof e.l==='string'?e.l:(e.l==6?'Teoremi':'Livello '+e.l);
const ESERCIZI=[
 {l:1,n:2,t:'Y = A · B',f:(a,b)=>a&b},
 {l:1,n:1,t:`Y = ${sopralineato('A')}`,f:a=>a^1},
 {l:1,n:2,t:'Y = A ⊕ B',f:(a,b)=>a^b},
 {...BASE[0],l:2},{...BASE[1],l:2},
 {l:2,n:2,t:`Y = ${sopralineato('A')} · ${sopralineato('B')}`,f:(a,b)=>(a^1)&(b^1)},
 {...BASE[2],l:2},{...BASE[3],l:2},
 {l:2,n:4,t:'Y = A · B + C · D',f:(a,b,c,d)=>(a&b)|(c&d)},
 {l:2,n:4,t:'Y = (A + B) · (C + D)',f:(a,b,c,d)=>(a|b)&(c|d)},
 {l:3,n:2,t:`Y = A · B + ${sopralineato('A')} · ${sopralineato('B')} (coincidenza)`,f:(a,b)=>(a&b)|((a^1)&(b^1))},
 {l:3,n:2,t:`Y = A · ${sopralineato('B')} + ${sopralineato('A')} · B`,f:(a,b)=>(a&(b^1))|((a^1)&b)},
 {...BASE[4],l:3},
 {l:3,n:3,t:`Y = A · B · C + ${sopralineato('A')} · ${sopralineato('B')} · ${sopralineato('C')} (tutti uguali)`,f:(a,b,c)=>(a&b&c)|((a^1)&(b^1)&(c^1))},
 {l:3,n:4,t:`Y = A · (B + C) · ${sopralineato('D')}`,f:(a,b,c,d)=>a&(b|c)&(d^1)},
 {...BASE[6],l:4},{...BASE[5],l:4},
 {l:4,n:3,t:'Y = A · B + C · (A ⊕ B) (riporto di un sommatore completo)',f:(a,b,c)=>(a&b)|(c&(a^b))},
 {l:4,n:4,t:'Y = A ⊕ B ⊕ C ⊕ D (parità a 4 bit)',f:(a,b,c,d)=>a^b^c^d},
 {...BASE[7],l:5},
 {l:5,n:4,t:`Comparatore AB > CD: Y = A · ${sopralineato('C')} + ${sopralineato('A ⊕ C')} · B · ${sopralineato('D')}`,f:(a,b,c,d)=>(a&(c^1))|(((a^c)^1)&b&(d^1))},
 {l:5,n:4,t:'Y = 1 se almeno due ingressi su quattro sono a 1',f:(a,b,c,d)=>a+b+c+d>=2?1:0},
 {l:5,n:4,t:'Y = 1 se il numero binario ABCD è multiplo di 3 (0, 3, 6, 9, 12, 15)',f:(a,b,c,d)=>(8*a+4*b+2*c+d)%3===0?1:0},
 {l:5,n:4,t:'Y = 1 se il numero binario ABCD è primo (2, 3, 5, 7, 11, 13)',f:(a,b,c,d)=>[2,3,5,7,11,13].includes(8*a+4*b+2*c+d)?1:0},
 {l:6,n:2,only:['OR','NOT'],t:`Y = ${sopralineato('A · B')} (solo porte OR e NOT)`,th:`De Morgan: ${sopralineato('A · B')} = ${sopralineato('A')} + ${sopralineato('B')}. La negazione di un prodotto è la somma delle negazioni.`,f:(a,b)=>(a&b)^1},
 {l:6,n:2,only:['AND','NOT'],t:`Y = ${sopralineato('A + B')} (solo porte AND e NOT)`,th:`De Morgan: ${sopralineato('A + B')} = ${sopralineato('A')} · ${sopralineato('B')}. La negazione di una somma è il prodotto delle negazioni.`,f:(a,b)=>(a|b)^1},
 {l:6,n:3,only:['OR','NOT'],t:`Y = ${sopralineato('A · B · C')} (solo porte OR e NOT)`,th:`De Morgan a tre variabili: ${sopralineato('A · B · C')} = ${sopralineato('A')} + ${sopralineato('B')} + ${sopralineato('C')}.`,f:(a,b,c)=>(a&b&c)^1},
 {l:6,n:2,only:['NOR'],t:'Y = A · B (solo porte NOR)',th:`Per De Morgan A · B è la negazione di (${sopralineato('A')} + ${sopralineato('B')}). Una NOR con gli ingressi uniti fa da NOT.`,f:(a,b)=>a&b},
 {l:6,n:2,only:['NAND'],t:'Y = A + B (solo porte NAND)',th:`Per De Morgan A + B è la negazione di (${sopralineato('A')} · ${sopralineato('B')}). Una NAND con gli ingressi uniti fa da NOT.`,f:(a,b)=>a|b},
 {l:6,n:2,only:['NAND'],min:4,t:'Y = A ⊕ B (solo porte NAND)',th:'La XOR si può realizzare con quattro porte NAND.',f:(a,b)=>a^b},
 {l:6,n:1,only:['NOT'],min:2,t:'Y = A usando due porte NOT',th:'Doppia negazione: negare due volte un segnale lo lascia invariato.',f:a=>a},
 {l:6,n:2,only:['AND','OR'],min:2,t:'Y = A + A · B (porte AND e OR)',th:'Assorbimento: A + A · B = A. L’uscita coincide con A.',f:a=>a},
 {l:6,n:3,only:['AND','OR'],min:3,t:'Y = A · B + A · C (porte AND e OR)',th:'Distributiva: A · (B + C) = A · B + A · C.',f:(a,b,c)=>a&(b|c)},
 {l:6,n:3,only:['AND','OR','NOT'],min:5,t:`Y = A · B + ${sopralineato('A')} · C + B · C`,th:`Consenso: il termine B · C è ridondante, equivale a A · B + ${sopralineato('A')} · C.`,f:(a,b,c)=>(a&b)|((a^1)&c)|(b&c)}
];
const LARGHEZZA_PORTA={AND:75,NAND:85,OR:75,NOR:85,XOR:83,XNOR:93,NOT:72};
const FORMA_PORTA={AND:'M0,0H45A30,30 0 0 1 45,60H0Z',OR:'M0,0Q35,0 75,30Q35,60 0,60Q20,30 0,0Z',NOT:'M8,8L8,52L62,30Z'};
let indiceEsercizio=0,esercizioCorrente=ESERCIZI[0],numeroIngressi=2,valoriIngressi=[0,0,0,0],porteLavagna=[],filiLavagna=[],selezione=null,pinInAttesa=null,prossimoIdPorta=1,trascinamentoPorta=null,messaggioRisultato='',modo3D=false;
let posizioneLed={x:730,y:220},areaVisibile={x:0,y:0,w:800,h:440},trascinamentoNodo=null,trascinamentoLed=null,spostamentoSfondo=null,pizzico=null,ultimoTocco=0,ultimoNodoToccato='';const puntatoriAttivi=new Map();
let pilaAnnulla=[],pilaRipeti=[],ultimoStatoSalvato='',bloccoCronologia=false,tentativiAnalisi=0,analisiInizializzata=false;
