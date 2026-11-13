/* =====================================================================
   aframe/01-label.js  -  Etichette di testo 3D
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Disegna un testo su un'immagine (canvas) e la applica a un piano.
   Uso nel HTML:  <a-entity label="text:A = 0;w:1.2">
   Parametri: text (testo), color, w (larghezza), fs (dimensione font).
   ===================================================================== */

AFRAME.registerComponent('label',{
  schema:{text:{type:'string'},color:{default:'#ffffff'},w:{default:1.2},fs:{default:150}},
  update(){
    const d=this.data,T=AFRAME.THREE,c=document.createElement('canvas');
    c.width=512;c.height=256;
    const x=c.getContext('2d');
    x.fillStyle=d.color;x.font='bold '+d.fs+'px sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.fillText(d.text,256,128);
    const old=this.el.getObject3D('mesh');
    if(old){old.material.map.dispose();old.material.dispose();old.geometry.dispose();}
    const t=new T.CanvasTexture(c);
    if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;
    this.el.setObject3D('mesh',new T.Mesh(new T.PlaneGeometry(d.w,d.w/2),new T.MeshBasicMaterial({map:t,transparent:true})));
  }
});
