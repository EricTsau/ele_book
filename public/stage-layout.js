// The story owns the whole spread. Scale figures uniformly; widen only the
// landscape so bodies, furniture and authored contact points keep their shape.
export function arrangeSpread(s){
 s.root.position.x=0;
 s.popup.scale.setScalar(1.45);
 for(const obj of s.popup.children){
  if(obj.geometry?.type==='CircleGeometry'){obj.scale.x*=1.42;obj.scale.y*=.75;}
  else if(obj.isMesh){obj.position.x*=1.4;obj.position.z*=.92;}
 }
 s.trees.forEach(tree=>{tree.position.x*=1.45;tree.position.z*=.94;});
 return s;
}
