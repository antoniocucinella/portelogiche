/* =====================================================================
   aframe/04-ico.js  -  Icone dei pulsanti nella scena 3D
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Disegna le icone (cestino, spunta, frecce...) su un canvas.
   Uso:  <a-entity ico="kind:del">
   ===================================================================== */

AFRAME.registerComponent('ico',{
  schema:{kind:{default:'del'}},
  update(){
    const T=AFRAME.THREE,c=document.createElement('canvas');c.width=c.height=128;
    const x=c.getContext('2d'),I={del:['#ef4444','M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6'],clr:['#64748b','M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5'],chk:['#16a34a','M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20M8 12.5l3 3 5-6'],nxt:['#2563eb','M5 4L15 12L5 20ZM19 5V19'],prv:['#2563eb','M19 4L9 12L19 20ZM5 5V19']}[this.data.kind];
    x.fillStyle=I[0];x.beginPath();if(x.roundRect)x.roundRect(4,4,120,120,24);else x.rect(4,4,120,120);x.fill();
    x.translate(24,24);x.scale(3.33,3.33);x.strokeStyle='#fff';x.lineWidth=2.2;x.lineCap='round';x.lineJoin='round';x.stroke(new Path2D(I[1]));
    const old=this.el.getObject3D('mesh');
    if(old){old.material.map.dispose();old.material.dispose();old.geometry.dispose();}
    const t=new T.CanvasTexture(c);if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;
    this.el.setObject3D('mesh',new T.Mesh(new T.PlaneGeometry(0.28,0.28),new T.MeshBasicMaterial({map:t,transparent:true})));
  }
});
