/* =====================================================================
   aframe/02-gate3d.js  -  Porta logica in 3D
   COMPONENTE A-FRAME. Un componente e' un "mattoncino" che si attacca
   a un'entita' della scena (<a-entity>) e ne definisce aspetto/comportamento.
   Costruisce la porta (AND, OR, NOT...) come solido estruso, con viti,
   piedini colorati (verdi se il segnale e' 1) e pallino di negazione.
   Uso:  <a-entity gate3d="kind:AND;on:true;ia:true;ib:false">
   ===================================================================== */

AFRAME.registerComponent('gate3d',{
  schema:{kind:{default:'AND'},on:{default:false},ia:{default:false},ib:{default:false},depth:{default:0.55}},
  update(){try{this.u2();}catch(e){console.error('gate3d',e);}},
  u2(){
    const T=AFRAME.THREE,d=this.data,k=d.kind,D=d.depth;
    const bub=/^(NAND|NOR|XNOR|NOT)$/.test(k),base=k==='NOT'?'NOT':(k==='XNOR'?'XOR':k.replace(/^N/,''));
    const tw=((bub?468:512)-288)/320,sh=new T.Shape();
    if(base==='AND'){const xm=tw-0.7;sh.moveTo(-0.7,0.7);sh.lineTo(xm,0.7);sh.absarc(xm,0,0.7,Math.PI/2,-Math.PI/2,true);sh.lineTo(-0.7,-0.7);sh.closePath();}
    else if(base==='NOT'){sh.moveTo(-0.606,0.5);sh.lineTo(-0.606,-0.5);sh.lineTo(tw,0);sh.closePath();}
    else{sh.moveTo(-0.7,0.7);sh.bezierCurveTo(-0.169,0.7,tw-0.344,0.519,tw,0);sh.bezierCurveTo(tw-0.344,-0.519,-0.169,-0.7,-0.7,-0.7);sh.quadraticCurveTo(-0.356,0,-0.7,0.7);}
    const ex={depth:D,bevelEnabled:true,bevelThickness:0.02,bevelSize:0.02,bevelSegments:3,curveSegments:24};
    const g=new T.ExtrudeGeometry(sh,ex);g.translate(0,0,-D/2);
    const COL=base==='NOT'?0xc8643f:(base==='AND'?0x4a78b0:0x6aa84f);
    const cap=new T.MeshStandardMaterial({color:COL,metalness:0.1,roughness:0.55,emissive:d.on?COL:0x000000,emissiveIntensity:d.on?0.35:0});
    const side=new T.MeshStandardMaterial({color:0x8e9097,metalness:0.25,roughness:0.5});
    const mat=[cap,side];
    const grp=new T.Group();grp.add(new T.Mesh(g,mat));
    if(base==='XOR'){
      const b=new T.Shape();b.moveTo(-0.806,0.7);b.quadraticCurveTo(-0.4625,0,-0.806,-0.7);b.lineTo(-0.76,-0.7);b.quadraticCurveTo(-0.4175,0,-0.76,0.7);b.closePath();
      const bg=new T.ExtrudeGeometry(b,{depth:D,bevelEnabled:false,curveSegments:24});bg.translate(0,0,-D/2);grp.add(new T.Mesh(bg,mat));
    }
    const holes=base==='NOT'?[[-0.4,0.3],[-0.4,-0.3],[0.15,0]]:[[-0.45,0.45],[-0.45,-0.45],[tw*0.5,0]];
    holes.forEach(([hx,hy])=>{
      const h=new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.01,24),new T.MeshStandardMaterial({color:0x1a1a1f,roughness:0.8}));
      h.rotation.x=Math.PI/2;h.position.set(hx,hy,D/2+0.024);grp.add(h);
      const r=new T.Mesh(new T.TorusGeometry(0.062,0.012,8,24),new T.MeshStandardMaterial({color:0xb4b7bf,metalness:0.5,roughness:0.4}));
      r.position.set(hx,hy,D/2+0.026);grp.add(r);
    });
    const collar=(x,y)=>{
      const c=new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.13,16),new T.MeshStandardMaterial({color:0xc4c7cf,metalness:0.5,roughness:0.35}));
      c.rotation.z=Math.PI/2;c.position.set(x,y,0);grp.add(c);
    };
    (k==='NOT'?[0]:[0.5,-0.5]).forEach(y=>collar(base==='NOT'?-0.67:-0.77,y));
    collar(0.77,0);
    const lead=(x1,x2,y,on)=>{
      const m=new T.Mesh(new T.CylinderGeometry(0.03,0.03,Math.abs(x2-x1),12),new T.MeshStandardMaterial({color:on?0x34d399:0x8b93a1,emissive:on?0x34d399:0x000000,emissiveIntensity:0.6}));
      m.rotation.z=Math.PI/2;m.position.set((x1+x2)/2,y,0);grp.add(m);
    };
    (k==='NOT'?[[0,d.ia]]:[[0.5,d.ia],[-0.5,d.ib]]).forEach(([y,v])=>lead(-0.825,-0.6,y,v));
    lead(0.7,0.825,0,d.on);
    if(bub){
      const bm=new T.Mesh(new T.CylinderGeometry(0.075,0.075,D+0.04,24),[side,cap,cap]);
      bm.rotation.x=Math.PI/2;bm.position.set(0.631,0,0);grp.add(bm);
    }
    const old=this.el.getObject3D('mesh');
    if(old)old.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>m.dispose());});
    this.el.setObject3D('mesh',grp);
  }
});
