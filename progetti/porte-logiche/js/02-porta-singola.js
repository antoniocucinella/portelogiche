/* =====================================================================
   js/02-porta-singola.js  -  SEZIONE "PORTA SINGOLA": aggiornaPortaSingola() e avviaProgramma()
   aggiornaPortaSingola() ridisegna TUTTO (scena 3D, vista 2D, pannello e tabella) ogni
             volta che cambia qualcosa (porta o ingressi).
   avviaProgramma()   collega i pulsanti e i clic alle funzioni; parte quando la
             scena A-Frame e' pronta.
   ===================================================================== */

function aggiornaPortaSingola(){
  const g=PORTE[portaScelta],one=g.n==1,y=one?g.f(A):g.f(A,B);
  try{disegnaVista2D();}catch(e){console.error(e);}
  try{
  const yA=one?0.7:1.2;
  $('#sA').setAttribute('position',{x:-2.2,y:yA,z:-4});
  $('#wA').setAttribute('position',{x:-1.3825,y:yA,z:-3.9});$('#pA').setAttribute('position',{x:-0.84,y:yA,z:-3.9});
  $('#lA').setAttribute('position',{x:-2.2,y:yA+0.55,z:-4});
  ['#sB','#wB','#lB','#pB'].forEach(s=>$(s).setAttribute('visible',!one));
  coloraOggetto3D($('#sA'),A,'#34d399','#6b7280');coloraOggetto3D($('#wA'),A,'#34d399','#8b93a1');
  coloraOggetto3D($('#sB'),B,'#34d399','#6b7280');coloraOggetto3D($('#wB'),B,'#34d399','#8b93a1');
  coloraOggetto3D($('#wY'),y,'#34d399','#8b93a1');coloraOggetto3D($('#led'),y,'#ff4d4d','#3a1212');
  impostaTesto3D('#lA','A = '+A);impostaTesto3D('#lB','B = '+B);impostaTesto3D('#lY','Y = '+y);$('#gl').setAttribute('gate3d',{kind:portaScelta,on:!!y,ia:!!A,ib:!!B});impostaTesto3D('#gn',portaScelta);
  document.querySelectorAll('.gbtn').forEach(e=>e.setAttribute('material','color',e.dataset.k===portaScelta?'#2563eb':'#2a3550'));
  $('#tt3').setAttribute('ttpanel','v',++contatoreAggiornamenti);
  }catch(err){console.error(err);}

  document.querySelectorAll('#gates button').forEach(b=>b.classList.toggle('on',b.dataset.k===portaScelta));
  $('#expr').innerHTML=g.expr;
  $('#bA').textContent='A = '+A;$('#bB').textContent='B = '+B;$('#bB').hidden=one;
  $('#hint').hidden=!modalitaPrevisione;$('#chk').hidden=!modalitaPrevisione;

  const rows=one?[[0],[1]]:[[0,0],[0,1],[1,0],[1,1]];
  let h='<tr><th>A</th>'+(one?'':'<th>B</th>')+'<th>Y</th></tr>';
  rows.forEach((r,i)=>{
    const cur=r[0]==A&&(one||r[1]==B);
    const real=one?g.f(r[0]):g.f(r[0],r[1]);
    let cell;
    if(!modalitaPrevisione){cell=`<td>${real}</td>`;}
    else{
      const v=ipotesi[i];
      const c=verificato?(v===real?'ok':'bad'):'';
      cell=`<td class="g ${c}" data-g="${i}">${v===undefined?'?':v}</td>`;
    }
    h+=`<tr class="${cur?'cur':''}" data-r="${r.join('')}"><td>${r[0]}</td>${one?'':`<td>${r[1]}</td>`}${cell}</tr>`;
  });
  $('#tt').innerHTML=h;
  disegnaVista2D();
}

function avviaProgramma(){
  if(window.__i)return;window.__i=1;
  Object.keys(PORTE).forEach(k=>{
    const b=document.createElement('button');
    b.innerHTML=`<span>${k}</span>${iconaPorta(k)}`;b.dataset.k=k;
    b.onclick=()=>{portaScelta=k;ipotesi=[];verificato=false;aggiornaPortaSingola();};
    $('#gates').appendChild(b);
  });
  $('#sA').addEventListener('click',()=>{A^=1;aggiornaPortaSingola();});
  $('#sB').addEventListener('click',()=>{if(PORTE[portaScelta].n>1){B^=1;aggiornaPortaSingola();}});
  $('#bA').onclick=()=>{A^=1;aggiornaPortaSingola();};
  $('#bB').onclick=()=>{B^=1;aggiornaPortaSingola();};
  $('#pred').onchange=e=>{modalitaPrevisione=e.target.checked;ipotesi=[];verificato=false;aggiornaPortaSingola();};
  $('#chk').onclick=()=>{verificato=true;aggiornaPortaSingola();};
  $('#tt').addEventListener('click',e=>{
    const gc=e.target.closest('[data-g]');
    if(gc){
      const i=+gc.dataset.g;
      ipotesi[i]=ipotesi[i]===undefined?0:(ipotesi[i]===0?1:undefined);
      verificato=false;aggiornaPortaSingola();return;
    }
    const tr=e.target.closest('tr[data-r]');
    if(tr){const v=tr.dataset.r;A=+v[0];if(v.length>1)B=+v[1];aggiornaPortaSingola();}
  });
  Object.keys(PORTE).forEach((k,i)=>{
    const e=document.createElement('a-entity');
    e.className='clickable gbtn';e.dataset.k=k;
    e.setAttribute('position',`${(i-3)*0.65} 2.15 -4`);
    e.setAttribute('geometry','primitive:plane;width:0.58;height:0.66');
    e.setAttribute('material','shader:flat;color:#2a3550');
    e.innerHTML=`<a-entity gatesym="kind:${k}" position="0 0.1 0.01" scale="0.27 0.27 0.27"></a-entity><a-entity label="text:${k};w:0.5" position="0 -0.25 0.01"></a-entity>`;
    e.addEventListener('click',()=>{if($('a-scene').is('vr-mode')){portaScelta=k;ipotesi=[];verificato=false;aggiornaPortaSingola();}});
    $('#vrui').appendChild(e);
  });
  $('#tt3').addEventListener('click',e=>{
    const it=e.detail&&e.detail.intersection;
    if(!it||!it.uv||!$('a-scene').is('vr-mode'))return;
    const one=PORTE[portaScelta].n==1,i=Math.floor(((1-it.uv.y)*380-116)/56);
    if(i<0||i>=(one?2:4))return;
    if(one)A=i;else{A=i>>1;B=i&1;}
    aggiornaPortaSingola();
  });
  const S=$('a-scene');
  S.addEventListener('enter-vr',()=>{$('#vrui').setAttribute('visible',true);const xr=S.renderer&&S.renderer.xr&&S.renderer.xr.isPresenting;if(document.body.classList.contains('c3on')&&!xr){entraInCircuiti3D();return;}$('#rig').setAttribute('position',{x:0,y:0,z:-1.5});$('#rig').setAttribute('rotation',{x:0,y:0,z:0});});
  S.addEventListener('exit-vr',()=>{const w=document.body.classList.contains('c3on');esciDaCircuiti3D();if(w)cambiaVista(true);if(modo3D)impostaCircuiti3D(false);$('#vrui').setAttribute('visible',false);posizionaTelecamera();});
  addEventListener('resize',adattaTelecamera);
  adattaTelecamera();aggiornaPortaSingola();
}
