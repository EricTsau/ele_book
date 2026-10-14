import {gsap} from 'gsap';
import {sceneGeometry as H} from '../public/book3d.js';
import {buildFairytaleScene,animateFairytale} from '../public/fairytale3d.js';
import {books} from '../public/books.js';
export function sceneFixture(id,index){
 const chapter=books.find(b=>b.id===id).chapters.find(c=>c.kind==='story'&&c.storyIndex===index);
 const scene=buildFairytaleScene(new H.THREE.Group(),chapter,H);
 const timeline=gsap.timeline({paused:true});animateFairytale(timeline,scene,chapter);
 return {scene,chapter,timeline,seek(t){timeline.seek(t,true);scene.root.updateMatrixWorld(true);return scene;},dispose(){timeline.kill();}};
}
export {H};
