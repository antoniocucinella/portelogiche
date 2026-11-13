/* =====================================================================
   aframe/03-rbox-geometry.js  -  Forma "rbox": cubo con gli spigoli arrotondati
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Si usa per gli interruttori 3D:  geometry="primitive:rbox;size:0.6"
   ===================================================================== */

AFRAME.registerGeometry('rbox',{
  schema:{size:{default:0.6},r:{default:0.09}},
  init(d){
    const T=AFRAME.THREE,s=d.size,b=d.r,a=s/2-b,rc=b,sh=new T.Shape();
    sh.moveTo(-a+rc,-a);sh.lineTo(a-rc,-a);sh.quadraticCurveTo(a,-a,a,-a+rc);
    sh.lineTo(a,a-rc);sh.quadraticCurveTo(a,a,a-rc,a);
    sh.lineTo(-a+rc,a);sh.quadraticCurveTo(-a,a,-a,a-rc);
    sh.lineTo(-a,-a+rc);sh.quadraticCurveTo(-a,-a,-a+rc,-a);
    const g=new T.ExtrudeGeometry(sh,{depth:s-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:5,curveSegments:8});
    g.translate(0,0,-(s/2-b));
    this.geometry=g;
  }
});
