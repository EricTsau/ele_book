import {gsap} from 'gsap';
import {sceneGeometry as H} from '../public/book3d.js';
import {buildFairytaleScene,animateFairytale} from '../public/fairytale3d.js';
import {updateInteriorVisibility} from '../public/interiors.js';
import {books} from '../public/books.js';
export function sceneFixture(id,index){
 const chapter=books.find(b=>b.id===id).chapters.find(c=>c.kind==='story'&&c.storyIndex===index);
 const scene=buildFairytaleScene(new H.THREE.Group(),chapter,H);
 const camera=new H.THREE.PerspectiveCamera();camera.position.set(0,7,9);
 const timeline=gsap.timeline({paused:true});animateFairytale(timeline,scene,chapter);
 return {scene,chapter,timeline,seek(t){timeline.seek(t,true);scene.root.updateMatrixWorld(true);updateInteriorVisibility(scene,camera);return scene;},dispose(){timeline.kill();}};
}
export {H};
