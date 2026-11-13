/* =====================================================================
   aframe/05-c3txt.js  -  Pannello di testo della sezione Circuiti 3D
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Mostra il titolo dell'esercizio (which:info) o il risultato della
   verifica (which:res). Legge le variabili globali esercizioCorrente, indiceEsercizio, ESERCIZI e messaggioRisultato
   definite in js/.
   ===================================================================== */

AFRAME.registerComponent('c3txt',{
  schema:{which:{default:'info'}},
  update(){
    const T=AFRAME.THREE,W=1000,H=150,c=document.createElement('canvas'),R=this.data.which==='res';
    c.width=W;c.height=H;
    const x=c.getContext('2d');
    x.fillStyle='rgba(20,20,28,0.9)';x.fillRect(0,0,W,H);
    x.textBaseline='alphabetic';x.textAlign='left';
    if(!R){
      x.fillStyle='#a0a0ad';x.font='28px sans-serif';
      x.fillText(etichettaLivello(esercizioCorrente)+' \u00b7 Esercizio '+(indiceEsercizio+1)+'/'+ESERCIZI.length+(esercizioCorrente.only?' \u00b7 solo '+esercizioCorrente.only.join(', '):''),24,38);
      x.fillStyle='#ffffff';x.font='bold 40px sans-serif';
      let px=24;const y=100;
      ('Realizza: '+esercizioCorrente.t).split(/(<span class=["']ov["']>.*?<\/span>)/).forEach(p=>{
        const ov=p.startsWith('<span'),t=ov?p.replace(/<[^>]+>/g,''):p;
        x.fillText(t,px,y);const w=x.measureText(t).width;
        if(ov)x.fillRect(px,y-38,w,4);
        px+=w;
      });
    }else{
      const L=messaggioRisultato?messaggioRisultato.replace(/<br>/g,'\n').replace(/<[^>]+>/g,'').split('\n').slice(0,3):['Collega le porte, poi premi la spunta verde per verificare.'];
      x.fillStyle=L[0].startsWith('\u2714')?'#4ade80':(L[0].startsWith('\u2718')?'#f87171':'#a0a0ad');
      x.font='bold 32px sans-serif';
      const wr=t=>{const o=[];let l='';t.split(' ').forEach(w=>{if(x.measureText(l+w).width>950){o.push(l);l=w+' ';}else l+=w+' ';});o.push(l);return o;};
      L.flatMap(wr).slice(0,3).forEach((l,i)=>x.fillText(l,24,44+i*40));
    }
    const old=this.el.getObject3D('mesh');
    if(old){old.material.map.dispose();old.material.dispose();old.geometry.dispose();}
    const t=new T.CanvasTexture(c);if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;
    this.el.setObject3D('mesh',new T.Mesh(new T.PlaneGeometry(R?3.4:3,R?0.51:0.45),new T.MeshBasicMaterial({map:t})));
  }
});
