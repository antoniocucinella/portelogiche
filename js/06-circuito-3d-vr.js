/* =====================================================================
   js/06-circuito-3d-vr.js  -  CIRCUITI IN 3D / REALTA' VIRTUALE
   Fa in 3D (A-Frame) quello che disegnaCircuito() fa in 2D.
   disegnaCircuito3D() ridisegna il circuito in 3D; impostaCircuiti3D() attiva/disattiva la modalita'.
   ===================================================================== */

/* ===== Circuiti 3D (VR) ===== */
const SCALA_3D=0.005,convertiPunto3D=(x,y)=>[(x-400)*SCALA_3D,1.4-(y-220)*SCALA_3D];
function posizionePin3D(id){
  if(id==='y')return convertiPunto3D(690,220);
  if(id[0]==='i')return[convertiPunto3D(xIngresso(+id.slice(1)),0)[0],0];
  const[a,p]=id.split('.'),g=porteLavagna.find(g=>'g'+g.id===a),[cx,cy]=convertiPunto3D(g.x+40,g.y+30);
  return p===undefined?[cx+0.18,cy]:[cx-0.18,cy+(g.k==='NOT'?0:(p==0?0.107:-0.107))];
}
function valoreIngressoPorta(g,p){const w=filiLavagna.find(w=>w.b===`g${g.id}.${p}`);return w?valoreSegnale(w.a,valoriIngressi):0;}
function disegnaCircuito3D(){
  let h='';
  const pin3=(id,dir,x,y)=>`<a-sphere class="clickable" data-pin="${id}" data-dir="${dir}" position="${x} ${y} -3.96" radius="0.05" color="${pinInAttesa&&pinInAttesa.id===id?'#2563eb':'#cbd5e1'}"></a-sphere>`;
  const seg=(x1,y1,x2,y2,c)=>{const w=Math.abs(x2-x1),t=Math.abs(y2-y1);return w+t<0.002?'':`<a-box position="${(x1+x2)/2} ${(y1+y2)/2} -3.99" width="${w||0.012}" height="${t||0.012}" depth="0.012" color="${c}"></a-box>`;};
  for(let i=0;i<numeroIngressi;i++){
    const x=convertiPunto3D(xIngresso(i),0)[0],c=valoriIngressi[i]?'#34d399':'#6b7280';
    h+=seg(x,convertiPunto3D(0,43)[1],x,convertiPunto3D(0,430)[1],c);
    h+=`<a-box class="clickable" data-pin="i${i}" data-dir="o" position="${x} ${convertiPunto3D(0,236)[1]} -3.99" width="0.12" height="${387*SCALA_3D}" depth="0.02" material="opacity:0;transparent:true"></a-box>`;
    h+=`<a-sphere class="clickable" data-t="${i}" position="${x} ${convertiPunto3D(0,30)[1]} -3.97" radius="0.08" color="${c}"></a-sphere>`;
    h+=`<a-entity label="text:${'ABCD'[i]};w:0.18" position="${x} ${convertiPunto3D(0,-8)[1]} -3.97"></a-entity>`;
  }
  filiLavagna.forEach(w=>{
    const[x2,y2]=posizionePin3D(w.b),inp=w.a[0]==='i',[x1,ay]=posizionePin3D(w.a),y1=inp?y2:ay,c=valoreSegnale(w.a,valoriIngressi)?'#34d399':'#8b93a1',xm=x2>x1+0.2?(x1+x2)/2:x1+0.1;
    if(inp)h+=seg(x1,y1,x2,y2,c)+`<a-sphere position="${x1} ${y1} -3.985" radius="0.02" color="#16a34a"></a-sphere>`;
    else h+=seg(x1,y1,xm,y1,c)+seg(xm,y1,xm,y2,c)+seg(xm,y2,x2,y2,c);
  });
  porteLavagna.forEach(g=>{
    const[cx,cy]=convertiPunto3D(g.x+40,g.y+30),isSel=selezione&&selezione.t==='g'&&selezione.i===g.id;
    if(isSel)h+=`<a-plane position="${cx} ${cy} -3.995" width="0.5" height="0.42" color="#2563eb" opacity="0.4"></a-plane>`;
    h+=`<a-entity gate3d="kind:${g.k};on:${!!valoreSegnale('g'+g.id,valoriIngressi)};ia:${!!valoreIngressoPorta(g,0)};ib:${!!valoreIngressoPorta(g,1)};depth:0.8" scale="0.214 0.214 0.214" position="${cx} ${cy} -3.98"></a-entity>`;
    h+=`<a-plane class="clickable" data-g="${g.id}" position="${cx} ${cy} -3.97" width="0.3" height="0.3" material="opacity:0;transparent:true"></a-plane>`;
    h+=`<a-entity label="text:${g.k};w:0.2" position="${cx} ${cy-0.22} -3.98"></a-entity>`;
    (g.k==='NOT'?[0]:[0.107,-0.107]).forEach((dy,p)=>h+=pin3(`g${g.id}.${p}`,'i',cx-0.18,cy+dy));
    h+=pin3('g'+g.id,'o',cx+0.18,cy);
  });
  const[lx_,ly]=convertiPunto3D(730,220),on=valoreUscita(valoriIngressi),[yx,yy]=convertiPunto3D(690,220);
  h+=`<a-sphere position="${lx_} ${ly+0.17} -3.97" scale="0.5 0.75 0.5" radius="0.2" material="color:${on?'#ff4d4d':'#3a1212'};emissive:${on?'#ff4d4d':'#000000'};emissiveIntensity:0.9"></a-sphere><a-cylinder position="${lx_-0.04} ${ly+0.04} -3.97" radius="0.008" height="0.08" color="#9ca3af"></a-cylinder><a-cylinder position="${lx_+0.04} ${ly+0.04} -3.97" radius="0.008" height="0.08" color="#9ca3af"></a-cylinder>`+seg(yx,yy,lx_+0.06,yy,on?'#34d399':'#8b93a1');
  h+=pin3('y','i',yx,yy);
  h+=`<a-entity c3txt="which:info" position="0.6 2.38 -3.97"></a-entity><a-entity c3txt="which:res" position="0 0.2 -3.97"></a-entity>`;
  $('#c3d').innerHTML=h;
}
function impostaCircuiti3D(on){
  modo3D=on;
  ['#sA','#sB','#lA','#lB','#wA','#wB','#pA','#pB','#pY','#gl','#gn','#wY','#ledg','#lY','#tt3'].forEach(s=>$(s).setAttribute('visible',!on));
  document.querySelectorAll('.gbtn').forEach(e=>{e.setAttribute('visible',!on);e.classList.toggle('clickable',!on);});
  ['#sA','#sB','#tt3'].forEach(s=>$(s).classList.toggle('clickable',!on));
  $('#c3').setAttribute('visible',on);
  $('#mtl').setAttribute('label','text',on?'PORTE':'CIRCUITI');
  if(on){
    let s='<a-plane class="clickable" data-bg="1" position="0 1.4 -4.05" width="4.4" height="2.4" color="#1d1d28"></a-plane>';
    Object.keys(PORTE).forEach((k,i)=>s+=`<a-entity class="clickable" data-add="${k}" geometry="primitive:plane;width:0.3;height:0.28" material="shader:flat;color:#2a3550" position="-2.5 ${2.15-i*0.32} -3.98"><a-entity gatesym="kind:${k}" position="0 0 0.01" scale="0.14 0.14 0.14"></a-entity></a-entity>`);
    ['del','clr','chk','prv','nxt'].forEach((a,j)=>s+=`<a-entity class="clickable" data-act="${a}" ico="kind:${a}" position="2.5 ${2.15-j*0.34} -3.98"></a-entity>`);
    $('#c3').innerHTML=s+'<a-entity id="c3d"></a-entity>';
    disegnaCircuito3D();
  }else{$('#c3').innerHTML='';aggiornaPortaSingola();}
  ['#hl','#hr'].forEach(s=>{const r=$(s).components.raycaster;if(r)r.refreshObjects();});
}
