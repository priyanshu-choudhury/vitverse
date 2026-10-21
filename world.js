import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mount = document.getElementById('worldMount');
const frame = document.querySelector('.scene-frame');
const fallback = document.getElementById('sceneFallback');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 800px)').matches;

const positions = {
  library: new THREE.Vector3(-2.7, 0, -1.25),
  tech: new THREE.Vector3(2.35, 0, -2),
  food: new THREE.Vector3(3.3, 0, 2.15),
  gate: new THREE.Vector3(-4.4, 0, 2.6),
  innovation: new THREE.Vector3(-.7, 0, 2.4)
};
const accents = { library: 0xd6c0ff, tech: 0xffb4bf, food: 0xffb58e, gate: 0xf3b6a9, innovation: 0xb3abff };
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x17172b, .017);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.4 : 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.32;
renderer.shadowMap.enabled = !mobile;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-label','3D interactive campus model. Use pointer to rotate or scroll to zoom.');
mount.appendChild(renderer.domElement);
const camera = new THREE.OrthographicCamera(-10,10,8,-8,.1,200);
camera.position.set(16.5, 18.5, 23.5);
camera.lookAt(0,0,0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = .065;
controls.enablePan = false;
controls.minPolarAngle = .48;
controls.maxPolarAngle = 1.27;
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;
controls.minZoom = .75;
controls.maxZoom = 2.1;
controls.rotateSpeed = .62;
controls.zoomSpeed = .75;
controls.target.set(0,0,0);

scene.add(new THREE.HemisphereLight(0xb2abff, 0x1b1526, 3.3));
const sun = new THREE.DirectionalLight(0xffd7cb, 4.0);
sun.position.set(-4,14,10);
sun.castShadow = !mobile;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;
sun.shadow.normalBias=.02;
scene.add(sun);
const rim = new THREE.PointLight(0x9f8dff, 35,35);
rim.position.set(6,7,-8);
scene.add(rim);

const mat = (color, metalness=.23, roughness=.53, more={}) => new THREE.MeshStandardMaterial({color,metalness,roughness,...more});
const platformMat = mat(0x3d375c,.33,.55);
const pavement = mat(0x5d5379,.27,.64);
const roadMat = mat(0x332d4d,.18,.7);
const lightStone = mat(0xe0d2f3,.2,.48);
const glass = mat(0x8e84c1,.49,.25,{transparent:true,opacity:.88});
const bronze = mat(0xffad9d,.3,.48);
const brass = mat(0xdfbaff,.48,.33);
const glowMat = color => new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9});
function box(w,h,d,m,x,y,z, parent=scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cyl(rt,rb,h,m,x,y,z,parent=scene,seg=32){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function ring(radius,color,x,z,opacity=.7){const mesh=new THREE.Mesh(new THREE.RingGeometry(radius-.02,radius,64),new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.1,z);scene.add(mesh);return mesh;}
function line(points,color,opacity=.7){const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const obj=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity}));scene.add(obj);return obj;}
// Rounded isometric plinth. Everything is illustrative, not actual campus geography.
function roundedShape(w,h,r){const s=new THREE.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
const plinth = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(13.8,10.5,.88),{depth:.42,bevelEnabled:true,bevelThickness:.17,bevelSize:.17,bevelSegments:3,steps:1,curveSegments:9}),platformMat);
plinth.rotation.x=-Math.PI/2;plinth.position.y=-.6;plinth.receiveShadow=true;scene.add(plinth);
const underPlinth = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(13.65,10.35,.9),{depth:.11,bevelEnabled:false,curveSegments:9}),new THREE.MeshBasicMaterial({color:0xa58cff,transparent:true,opacity:.25}));
underPlinth.rotation.x=-Math.PI/2;underPlinth.position.y=-.84;scene.add(underPlinth);
// Grid lines, a legible road network, planting and tiny scenic lights.
for(let x=-6.2;x<=6.4;x+=.54)line([[x,.025,-4.75],[x,.025,4.75]],0x8c82bd,.16);
for(let z=-4.6;z<=4.6;z+=.54)line([[-6.4,.025,z],[6.4,.025,z]],0x8c82bd,.16);
box(12.2,.035,.82,roadMat,0,.03,.22);
box(.78,.036,9,roadMat,.48,.035,0);
box(10,.035,.43,roadMat,0,.035,-3.55);
for(let x=-5.6;x<=5.6;x+=.69){box(.29,.015,.025,mat(0x9f8daf,.05,.8),x,.062,.22);}
for(let z=-4.1;z<=4.1;z+=.7){box(.025,.014,.24,mat(0x9f8daf,.05,.8),.48,.063,z);}
// tiny landscape clusters
const bushes = mat(0x8779ae,.18,.83);
const shrubs = mat(0xc88fba,.13,.81);
for(let i=0;i<47;i++){
  const a=i*2.39996, rr=1.1+Math.sqrt(i/47)*5;
  const x=Math.cos(a)*rr, z=Math.sin(a)*rr*.78;
  if(Math.abs(x)<.9||Math.abs(z-.22)<.64||Object.values(positions).some(p=>Math.hypot(p.x-x,p.z-z)<1.5))continue;
  cyl(.09+((i*7)%9)/140,.12,.2+(i%3)*.06,i%4===0?shrubs:bushes,x,.17,z,scene,7);
}
for(let i=0;i<20;i++){
  const x=((i*29)%105)/10-5.2,z=((i*17)%86)/10-4.3;
  if(Math.abs(x)>.7&&Math.abs(z-.22)>.7){const dot=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),glowMat(i%3===0?0xffbd9c:0xd2bdff));dot.position.set(x,.12,z);scene.add(dot);}
}
const buildings = {};
function makeBuilding(id, maker){const group=new THREE.Group();group.position.copy(positions[id]);scene.add(group);buildings[id]=group;maker(group);}
function terrace(g,w,d){box(w,.17,d,mat(0x9385ae,.22,.65),0,.13,0,g);}
makeBuilding('library',g=>{
  terrace(g,2.95,2.65);
  box(2.2,1.6,1.9,lightStone,0,1.02,0,g);
  box(2.4,.17,2.1,brass,0,1.88,0,g);
  box(2.13,.43,1.84,glass,0,2.18,0,g);
  box(2.35,.18,2.06,lightStone,0,2.44,0,g);
  for(let j=-3;j<=3;j++)box(.065,1.45,.095,mat(0xb9add1),j*.28,1.03,1.002,g);
  for(let j=0;j<4;j++)box(.09,.08,1.85,mat(0xe5a7b7),-1+j*.62,1.83,0,g);
  cyl(.21,.28,.27,bronze,0,2.71,0,g);
});
makeBuilding('tech',g=>{
  terrace(g,2.6,2.4);
  box(1.5,3.35,1.32,glass,0,1.95,0,g);
  box(1.7,.22,1.5,lightStone,0,3.7,0,g);
  for(let i=0;i<11;i++){box(1.52,.045,1.35,mat(i%2===0?0xe1c6ea:0xcbaaca,.32,.5),0,.53+i*.29,0,g);}
  for(let i=-1;i<=1;i++)box(.075,2.8,.08,mat(0xeedbec,.25,.3),i*.46,1.94,.7,g);
  box(.56,2.0,.85,mat(0x9a84b4,.25,.54),1.02,1.22,.07,g);
  cyl(.05,.05,.7,bronze,0,4.15,0,g);
});
makeBuilding('food',g=>{
  terrace(g,2.85,2.5);
  box(2.23,.67,1.62,mat(0xe9b5b1),0,.52,0,g);
  box(2.5,.19,1.9,bronze,0,1.0,0,g);
  for(let x of [-.83,-.28,.28,.83])box(.38,.53,.07,glass,x,.58,.85,g);
  const canopy=cyl(1.32,1.38,.18,mat(0xefccdc,.18,.54),0,1.2,0,g,7);canopy.rotation.y=Math.PI/7;
  for(let i=0;i<4;i++)cyl(.18,.18,.18,mat(0x9f86bf),-1+i*.67,.25,1.4,g,12);
});
makeBuilding('gate',g=>{
  terrace(g,2.7,2.2);
  box(.52,1.9,.53,lightStone,-.86,1.12,0,g);
  box(.52,1.9,.53,lightStone,.86,1.12,0,g);
  box(2.28,.4,.6,bronze,0,2.19,0,g);
  box(2.5,.11,.8,lightStone,0,2.47,0,g);
  box(1.2,.14,.1,mat(0xd6b0dd),0,1.96,.38,g);
  cyl(.24,.27,.32,bronze,-.86,2.34,0,g,6);
  cyl(.24,.27,.32,bronze,.86,2.34,0,g,6);
});
makeBuilding('innovation',g=>{
  terrace(g,2.7,2.7);
  cyl(1.02,1.11,.77,mat(0x9d90d0,.25,.37),0,.57,0,g,10);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(.95,32,18,0,Math.PI*2,0,Math.PI/2),mat(0xb2a5ea,.36,.27,{transparent:true,opacity:.9}));dome.position.y=.96;dome.castShadow=true;g.add(dome);
  const fin=new THREE.Mesh(new THREE.TorusGeometry(.94,.053,8,60),bronze);fin.rotation.x=Math.PI/2;fin.position.y=.99;g.add(fin);
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9;box(.12,.55,.11,lightStone,Math.cos(a)*1.1,.36,Math.sin(a)*1.1,g);}
  cyl(.1,.1,.58,glowMat(0xfbc2d2),0,1.89,0,g);
});
// Rings and location beacons
const locationRings={}, selectionRings=[];
Object.entries(positions).forEach(([id,p])=>{
  locationRings[id] = ring(1.4,accents[id],p.x,p.z,.22);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,1.18,6),new THREE.MeshBasicMaterial({color:accents[id],transparent:true,opacity:.5}));
  beam.position.set(p.x,3.5,p.z);scene.add(beam);
  const cap=new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshBasicMaterial({color:accents[id]}));cap.position.set(p.x,4.12,p.z);scene.add(cap);
});
for(let n=0;n<3;n++){
  const selectRing = ring(1.55+n*.24,0xffb993,positions.library.x,positions.library.z,.48-n*.13);
  selectionRings.push(selectRing);
}
// Floating particles in the air
const pointCount = mobile?70:125;
const pointPositions=new Float32Array(pointCount*3);
for(let i=0;i<pointCount;i++){
  pointPositions[i*3]=(Math.random()-.5)*27;
  pointPositions[i*3+1]=Math.random()*9+.4;
  pointPositions[i*3+2]=(Math.random()-.5)*22;
}
const particlesGeo=new THREE.BufferGeometry();particlesGeo.setAttribute('position',new THREE.BufferAttribute(pointPositions,3));
const particles = new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xd0b6ff,size:.055,transparent:true,opacity:.65,sizeAttenuation:true,depthWrite:false}));scene.add(particles);

let current='library', routeLine=null, routeGlow=null, routePath=null, routeNodes=[],routeProgress=0;
const targetFocus = new THREE.Vector3();
function focus(id){if(!positions[id])return;current=id;const p=positions[id];targetFocus.set(p.x*.09,0,p.z*.09);selectionRings.forEach((r,n)=>{r.position.x=p.x;r.position.z=p.z;r.material.color.setHex(accents[id]);});Object.values(locationRings).forEach((r)=>r.material.opacity=.17);locationRings[id].material.opacity=.68;}
function clearRoute(){if(routeLine){scene.remove(routeLine);routeLine.geometry.dispose();routeLine.material.dispose();routeLine=null;}if(routeGlow){scene.remove(routeGlow);routeGlow.geometry.dispose();routeGlow.material.dispose();routeGlow=null;}for(let item of routeNodes){scene.remove(item);item.geometry.dispose();item.material.dispose();}routeNodes=[];routePath=null;}
function renderRoute(from,to){
  if(!positions[from]||!positions[to])return;
  clearRoute();
  const a=positions[from],b=positions[to];
  const mid = a.clone().lerp(b,.5);mid.y=.22;
  const c=new THREE.Vector3((a.x+b.x)/2+.8,.2,(a.z+b.z)/2-.5);
  routePath=new THREE.CatmullRomCurve3([new THREE.Vector3(a.x,.21,a.z),new THREE.Vector3(a.x*.76+c.x*.24,.28,a.z*.76+c.z*.24),mid,new THREE.Vector3(b.x*.75+c.x*.25,.28,b.z*.75+c.z*.25),new THREE.Vector3(b.x,.21,b.z)]);
  const pts=routePath.getPoints(92);
  routeLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0xffcfb0,dashSize:.19,gapSize:.095,transparent:true,opacity:.96}));routeLine.computeLineDistances();scene.add(routeLine);
  routeGlow=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),new THREE.MeshBasicMaterial({color:0xffac88}));scene.add(routeGlow);
  for(let id of [from,to]){const p=positions[id];const n=ring(.48,0xffd1aa,p.x,p.z,.95);routeNodes.push(n);}
  routeProgress=0;
  focus(to);
}

document.addEventListener('vitverse:select',e=>focus(e.detail.id));
document.addEventListener('vitverse:route',e=>renderRoute(e.detail.from,e.detail.to));
for(let [id,el] of Object.entries(Object.fromEntries([...document.querySelectorAll('.map-marker')].map(m=>[m.dataset.place,m])))){
  el.addEventListener('mouseenter',()=>{if(positions[id]){locationRings[id].material.opacity=.94;}});
  el.addEventListener('mouseleave',()=>{if(positions[id]&&id!==current){locationRings[id].material.opacity=.2;}});
}
const initialOffset = new THREE.Vector3(16.5,18.5,23.5);
document.getElementById('zoomIn').addEventListener('click',()=>{camera.zoom=Math.min(camera.zoom*1.22,controls.maxZoom);camera.updateProjectionMatrix();});
document.getElementById('zoomOut').addEventListener('click',()=>{camera.zoom=Math.max(camera.zoom/1.22,controls.minZoom);camera.updateProjectionMatrix();});
document.getElementById('resetView').addEventListener('click',()=>{
  camera.position.copy(initialOffset);controls.target.set(0,0,0);targetFocus.set(0,0,0);camera.zoom=1;camera.updateProjectionMatrix();controls.update();clearRoute();
  document.getElementById('sceneState').textContent='EXPLORE MODE';
  window.VITVERSE?.toast('3D camera and route reset.');
});

let width=0,height=0;
function resize(){
  width=Math.max(10,mount.clientWidth);height=Math.max(10,mount.clientHeight);
  const a=width/height;
  const size=mobile?10.5:9.4;
  camera.left=-size*a/2;camera.right=size*a/2;camera.top=size/2;camera.bottom=-size/2;
  camera.updateProjectionMatrix();renderer.setSize(width,height,false);
}
resize();
if(typeof ResizeObserver!=='undefined'){new ResizeObserver(resize).observe(mount);} else window.addEventListener('resize',resize);
function placeMarkers(){
  const frameRect=frame.getBoundingClientRect(),canvasRect=mount.getBoundingClientRect();
  for(const [id,p] of Object.entries(positions)){
    const point=p.clone();point.y=id==='tech'?4.5:id==='library'?3.2:id==='innovation'?2.45:2.85;
    point.project(camera);
    const x=canvasRect.left-frameRect.left+(point.x+1)*.5*canvasRect.width;
    const y=canvasRect.top-frameRect.top+(-point.y+1)*.5*canvasRect.height;
    const el=document.querySelector(`.map-marker[data-place="${id}"]`);
    el.style.left=`${x}px`;el.style.top=`${y}px`;
    el.style.opacity=point.z>1||x<10||x>frameRect.width-8||y<45||y>frameRect.height-40?'0':'1';
    el.style.pointerEvents=el.style.opacity==='0'?'none':'auto';
  }
}
const clock = new THREE.Clock();
let last=0;
function animate(){
  requestAnimationFrame(animate);
  const t=clock.getElapsedTime();
  // Cap costly renders when tab is inactive; keep controls responsive.
  if(document.hidden||t-last<1/(reduceMotion?15:60))return;
  last=t;
  if(!reduceMotion){
    particles.rotation.y=t*.003;
    buildings.innovation.rotation.y=Math.sin(t*.37)*.02;
    selectionRings.forEach((r,n)=>{r.material.opacity=.24+(.24*Math.sin(t*1.65-n*.75)+.24);r.scale.setScalar(1+Math.sin(t*1.28+n)*.065);});
    if(routeLine) routeLine.material.dashOffset=-t*.43;
    if(routeGlow&&routePath){routeProgress=(routeProgress+.0033)%1;routeGlow.position.copy(routePath.getPointAt(routeProgress));routeGlow.position.y+=.14;}
  }
  controls.target.lerp(targetFocus,.017);
  controls.update();
  renderer.render(scene,camera);
  placeMarkers();
}
focus(window.VITVERSE?.getSelected() || 'library');
resize();
frame.classList.add('world-ready');
fallback.style.display='none';
animate();
