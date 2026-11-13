/* =====================================================================
   aframe/07-gatesym.js  -  Simbolo 2D di una porta, usato dentro la scena 3D
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Disegna con il canvas il simbolo classico della porta; serve per i
   pulsanti di scelta porta nel visore VR.
   ===================================================================== */

AFRAME.registerComponent('gatesym',{
  schema:{kind:{default:'AND'},on:{default:false},ia:{default:false},ib:{default:false}},
  update(){
    const d=this.data,T=AFRAME.THREE,c=document.createElement('canvas');
    c.width=576;c.height=512;
    const x=c.getContext('2d'),k=d.kind;
    const bub=/^(NAND|NOR|XNOR|NOT)$/.test(k);
    const base=k==='NOT'?'NOT':(k==='XNOR'?'XOR':k.replace(/^N/,''));
    const tip=bub?468:512,x0=64,top=32,bot=480,cy=256;
    x.lineWidth=10;x.lineJoin='round';x.lineCap='round';
    x.strokeStyle=d.on?'#34d399':'#e8ecf8';x.fillStyle='#2a3550';
    const lc=v=>v?'#34d399':'#8b93a1',ld=(x1,y,x2,v)=>{x.strokeStyle=lc(v);x.beginPath();x.moveTo(x1,y);x.lineTo(x2,y);x.stroke();};
    (k==='NOT'?[[cy,d.ia]]:[[96,d.ia],[416,d.ib]]).forEach(([y,v])=>ld(24,y,x0+45,v));
    ld(512,cy,552,d.on);
    x.strokeStyle=d.on?'#34d399':'#e8ecf8';
    if(base==='NOT'){
      x.beginPath();x.moveTo(x0,cy);x.lineTo(x0+30,cy);x.stroke();
      x.beginPath();x.moveTo(x0+30,96);x.lineTo(x0+30,416);x.lineTo(tip,cy);x.closePath();x.fill();x.stroke();
    }else if(base==='AND'){
      const xm=tip-224;
      x.beginPath();x.moveTo(x0,top);x.lineTo(xm,top);x.arc(xm,cy,224,-Math.PI/2,Math.PI/2);x.lineTo(x0,bot);x.closePath();x.fill();x.stroke();
    }else{
      [96,416].forEach(y=>{x.beginPath();x.moveTo(x0-14,y);x.lineTo(x0+45,y);x.stroke();});
      x.beginPath();x.moveTo(x0,top);x.bezierCurveTo(x0+170,top,tip-110,90,tip,cy);
      x.bezierCurveTo(tip-110,422,x0+170,bot,x0,bot);
      x.quadraticCurveTo(x0+110,cy,x0,top);x.closePath();x.fill();x.stroke();
      if(base==='XOR'){x.beginPath();x.moveTo(x0-34,top);x.quadraticCurveTo(x0+76,cy,x0-34,bot);x.stroke();}
    }
    if(bub){x.beginPath();x.arc(tip+22,cy,22,0,Math.PI*2);x.fillStyle='#14141c';x.fill();x.stroke();}
    const old=this.el.getObject3D('mesh');
    if(old){old.material.map.dispose();old.material.dispose();old.geometry.dispose();}
    const tex=new T.CanvasTexture(c);
    if(T.SRGBColorSpace)tex.colorSpace=T.SRGBColorSpace;
    this.el.setObject3D('mesh',new T.Mesh(new T.PlaneGeometry(1.8,1.6),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false})));
  }
});
