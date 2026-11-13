/* =====================================================================
   aframe/06-ttpanel.js  -  Tabella di verita' 3D
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Disegna su un canvas la tabella della porta scelta e evidenzia la
   riga corrente (variabili globali: portaScelta, A, B, PORTE).
   ===================================================================== */

AFRAME.registerComponent('ttpanel',{
  schema:{v:{default:0}},
  update(){
    const T=AFRAME.THREE,W=420,H=380,c=document.createElement('canvas');
    c.width=W;c.height=H;
    const x=c.getContext('2d'),g=PORTE[portaScelta],one=g.n==1;
    x.fillStyle='#1d1d28';x.fillRect(0,0,W,H);
    x.strokeStyle='#6ea0ff';x.lineWidth=6;x.strokeRect(3,3,W-6,H-6);
    x.fillStyle='#f2f2f6';x.font='bold 30px sans-serif';x.textAlign='left';x.textBaseline='alphabetic';
    let px=24;
    g.expr.split(/(<span class='ov'>.*?<\/span>)/).forEach(p=>{
      const ov=p.startsWith('<span'),t=ov?p.replace(/<[^>]+>/g,''):p;
      x.fillText(t,px,56);const w=x.measureText(t).width;
      if(ov)x.fillRect(px,28,w,3);
      px+=w;
    });
    const cols=one?[130,290]:[90,210,330],hd=one?['A','Y']:['A','B','Y'];
    x.textAlign='center';x.font='bold 28px sans-serif';x.fillStyle='#a0a0ad';
    hd.forEach((h,i)=>x.fillText(h,cols[i],100));
    const rows=one?[[0],[1]]:[[0,0],[0,1],[1,0],[1,1]];
    rows.forEach((r,i)=>{
      const yy=150+i*56,cur=r[0]==A&&(one||r[1]==B),real=g.f(r[0],r[1]||0);
      if(cur){x.fillStyle='#26385e';x.fillRect(14,yy-34,W-28,50);}
      x.font=(cur?'bold ':'')+'30px sans-serif';
      const vals=one?[r[0],real]:[r[0],r[1],real];
      vals.forEach((v,j)=>{x.fillStyle=j==vals.length-1?(v?'#4ade80':'#f87171'):(cur?'#ffffff':'#d8d8e0');x.fillText(v,cols[j],yy);});
    });
    const old=this.el.getObject3D('mesh');
    if(old){old.material.map.dispose();old.material.dispose();old.geometry.dispose();}
    const t=new T.CanvasTexture(c);
    if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;
    this.el.setObject3D('mesh',new T.Mesh(new T.PlaneGeometry(2.1,1.9),new T.MeshBasicMaterial({map:t})));
  }
});
