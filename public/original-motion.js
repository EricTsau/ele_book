// Chapter-specific blocking for the ten original books. All state belongs to the
// finite GSAP timeline: no timers, reparenting, callbacks, or random destinations.
export function originalEvent(tl,s,c,M){
 const {walk,reach,hop,look}=M,a=s.pigs,e=s.effects,i=c.storyIndex;
 const ids=['lantern-with-many-windows','rain-post-office','bridge-that-listened','shadow-takes-a-day-off','seed-library-notebook','clock-with-a-breath','paper-boat-map','cloud-tailor-pockets','bakery-under-the-stars','orchestra-of-small-sounds'];
 if(!ids.includes(c.storyId)||i<0||i>5)return false;
 const p=k=>s.props.children.find(o=>o.userData.prop===k),first=a[0],second=a[1];
 const move=(o,v,t,d=1)=>{if(o)tl.to(o.position,{...v,duration:d,ease:'sine.inOut'},t);};
 const rotate=(o,v,t,d=1)=>{if(o)tl.to(o.rotation,{...v,duration:d,ease:'sine.inOut'},t);};
 const scale=(o,v,t,d=1)=>{if(o)tl.to(o.scale,{...v,duration:d,ease:'sine.inOut',...(t===0&&d===0?{immediateRender:true}:{})},t);};
 const arm=(actor,x,t,d=.3,repeat=1)=>{if(actor)for(const limb of actor.arms)tl.to(limb.rotation,{x,duration:d,repeat,yoyo:true},t);};
 const nod=(actor,t)=>{if(actor)tl.to(actor.root.rotation,{x:.13,duration:.3,repeat:3,yoyo:true},t);};
 const crouch=(actor,t)=>{if(actor){rotate(actor.root,{x:.38},t,.6);move(actor.root,{y:-.09},t,.6);}};
 const stand=(actor,t)=>{if(actor){rotate(actor.root,{x:0,z:0},t,.6);move(actor.root,{y:0},t,.6);}};
 const write=(actor,t,cycles=4)=>{if(actor){rotate(actor.root,{x:.22},t,.3);for(const [j,limb]of actor.arms.entries())tl.to(limb.rotation,{x:j?-.55:-1.02,z:j?0:.2,duration:.24,repeat:cycles*2-1,yoyo:true},t);rotate(actor.root,{x:0},t+cycles*.48,.3);}};
 const openBook=(t)=>{const book=p('books')?.children.at(-1);if(book){move(book,{y:1,z:.5},t,.8);rotate(book,{x:-.48,y:.35},t+.7,1);}};
 const flap=(bird,t,duration=3)=>{if(bird)for(const [j,w]of bird.arms.entries())tl.to(w.rotation,{z:j?-.82:.82,duration:.25,repeat:Math.max(1,Math.floor(duration/.25)-1),yoyo:true},t);};
 const face=(actor,y,t)=>{if(actor)rotate(actor.root,{y},t,.4);};
 const settle=(actor,x,z,t=1.2,d=2)=>{
  // Explicit first stride also fixes exact-start seeking after a replay: GSAP's
  // deferred fromTo otherwise leaves the reset pose at the same timestamp.
  if(actor){
   actor.legs.forEach((limb,j)=>tl.set(limb.rotation,{x:j%2?-.38:.38},t));
   actor.arms.forEach((limb,j)=>tl.set(limb.rotation,{x:j%2?.3:-.3},t));
  }
  walk(tl,actor,x,z,t,d);
 };
 const glow=(t)=>{const light=p('lantern')?.children[0];if(light?.material?.color)tl.to(light.material.color,{r:1,g:.83,b:.42,duration:1.4},t);};
 if(c.storyId==='lantern-with-many-windows'){
  const lamp=p('lantern');
  switch(i){
   case 0: // The gust damages the hanging lamp; the child catches and inspects it.
    rotate(lamp,{z:.2},1.3,.5);rotate(lamp,{z:-.22},1.8,.5);move(lamp,{y:-.22},2.3,.8);
    settle(first,-.48,-.1,2,1.8);reach(tl,first,4,{bend:.4});rotate(lamp,{z:.12},4.2,.5);settle(second,.65,.05,5,2);crouch(second,7);look(tl,first,8,.4);stand(second,10);nod(first,12);break;
   case 1: // Rotate the frame between repeated attempts at covering its holes.
    settle(first,-.5,-.12);settle(second,.55,.1,1.4,2);reach(tl,first,3.6,{repeat:2});rotate(lamp,{y:.6},5,1);reach(tl,first,6.3,{repeat:2});rotate(lamp,{y:-.35},8,1);crouch(first,9);look(tl,second,10,-.55);reach(tl,second,11,{bend:.1});stand(first,12.8);break;
   case 2: // Different windows are inspected from both sides before relighting.
    settle(first,-.65,-.05);settle(second,.62,-.08,1.6,2);reach(tl,second,3.9,{bend:.14});rotate(lamp,{y:.85},4.5,1.5);reach(tl,first,6.2,{bend:.15});rotate(lamp,{y:-.6},7,1.5);glow(8.6);settle(first,-1,1.05,10,1.5);settle(second,.9,1.05,10.3,1.5);nod(first,12);hop(tl,second,13,.13);break;
   case 3: // The mouse tests the lowest step while the child redirects the light.
    settle(first,-.45,-.1);settle(second,.7,-.2,1.5,2);settle(a[2],-.95,.95,2,2);reach(tl,first,4,{repeat:2});rotate(lamp,{x:.13,y:-.25},5,1.2);settle(a[2],.2,1.1,6,3);crouch(a[2],9.3);reach(tl,second,9.5,{bend:.12});glow(10);stand(a[2],11);settle(a[2],1.1,.65,11.8,2);break;
   case 4: // Both carry the lamp beneath the porch, then check the path below.
    settle(first,-.5,-.05);settle(second,.5,-.05,1.5,2);arm(first,-.9,3.8,.4,0);arm(second,-.9,3.8,.4,0);move(lamp,{y:.35,x:.5,z:-1.2},4.2,2.3);rotate(lamp,{y:.35},6.6,1);settle(first,-.9,1.1,8,2);look(tl,first,10,.7);settle(second,.8,.8,9,2);glow(11.2);arm(first,0,12,.4,0);arm(second,0,12,.4,0);break;
   case 5: // Mouse offers the new panel; child fixes it and records the repair.
    settle(second,.4,.35);reach(tl,second,3.4,{bend:.1});settle(first,-.45,.1,2.8,1.7);reach(tl,first,4.8,{repeat:2});rotate(lamp,{y:Math.PI*.6},6.7,1.3);write(first,8,4);rotate(lamp,{y:0},10.5,1.3);glow(11.3);settle(first,-.9,1.1,12,1.5);hop(tl,second,13.5,.12);break;
  }return true;
 }
 if(c.storyId==='rain-post-office'){
  const letter=e.letter,bird=a.find(v=>v.type==='dove');
  switch(i){
   case 0: // Retrieve, unfold and turn over an unexpectedly blank envelope.
    settle(first,-.45,.1);reach(tl,first,3.5,{bend:.48});move(letter,{x:-.35,y:.8,z:.4},3.9,.8);rotate(letter,{y:Math.PI},5,1.5);look(tl,first,6.7,.6);settle(bird,.65,.55,7,2);rotate(letter,{y:Math.PI*2},9,1.3);face(first,.55,10.5);nod(bird,11.5);break;
   case 1: // Sit at turtle height, listen, then draw the described landmarks.
    settle(first,-.6,.4);settle(second,.55,.45,1.5,2);crouch(first,3.7);face(first,.65,4);nod(second,5);move(letter,{x:-.3,y:.25,z:.6},5.5,.7);rotate(letter,{x:-1.05},6,.6);write(first,7,6);stand(first,11);move(letter,{y:.8},11.5,1);face(first,.55,12.5);break;
   case 2: // Bird takes the letter upriver but returns instead of guessing a house.
    move(letter,{x:.55,y:.62,z:.65},2,1);settle(bird,.55,.35,1.3,1.5);move(bird?.root,{x:1.5,y:1.35,z:-1},3.3,2.8);move(letter,{x:1.5,y:1.95,z:-.7},3.3,2.8);flap(bird,3.3,8);rotate(bird?.root,{y:-1},6.3,.5);look(tl,bird,7,-.7);move(bird?.root,{x:.55,y:0,z:.45},9,2.5);move(letter,{x:.55,y:.6,z:.7},9,2.5);reach(tl,first,12,{bend:.15});nod(a[2],13);break;
   case 3: // Write the precise address, read it back, invite the turtle's print.
    settle(first,-.5,.35);settle(second,.6,.4,1.5,2);move(letter,{x:0,y:.28,z:.6},3.5,.6);rotate(letter,{x:-1},3.5,.6);write(first,4.2,5);move(letter,{y:.82},7,.8);rotate(letter,{x:0,y:.5},7,.8);nod(second,9);move(letter,{y:.15,x:.45},10,.7);reach(tl,second,11,{bend:.35});rotate(letter,{x:0,y:0},12.5,.6);move(letter,{y:1,x:0},12.5,1);break;
   case 4: // Deliver the reply, read together, turtle celebrates the news.
    move(bird?.root,{x:1,y:1.2,z:-.4},1.2,1);move(letter,{x:1,y:1.8,z:-.15},1.2,1);flap(bird,1.2,3);move(bird?.root,{x:.65,y:0,z:.4},3,1.5);move(letter,{x:-.3,y:.85,z:.55},3,1.8);reach(tl,first,4.5,{bend:.12});settle(a[2],.1,.9,5.2,2.5);rotate(letter,{y:.45},7.7,.7);nod(first,9);nod(a[2],10);hop(tl,a[2],12,.09);break;
   case 5: // Lower the writing surface for a new writer and let him try himself.
    settle(first,-.6,.45);settle(second,.6,.45,1.4,2);openBook(3.8);move(letter,{x:.4,y:.2,z:.7},4,.8);rotate(letter,{x:-1.25},4,.8);reach(tl,first,5,{bend:.18});write(second,6.3,7);look(tl,first,8,.65);move(letter,{y:.8},10.5,.9);rotate(letter,{x:0,y:-.3},10.5,.9);nod(first,12);hop(tl,second,13,.09);break;
  }return true;
 }
 if(c.storyId==='bridge-that-listened'){
  const bridge=p('bridge');
  switch(i){
   case 0: // Lay out a model and look from the top down to the turtle's approach.
    scale(bridge,{x:.65,y:.65,z:.65},1.2,.8);settle(first,-.55,.1);reach(tl,first,3.5,{repeat:2});settle(second,.85,.3,4.2,2);look(tl,second,6.5,-.5);settle(a[2],-1.15,.6,5,2.5);crouch(first,8);face(first,-.8,9);look(tl,a[2],10,.35);stand(first,12);break;
   case 1: // Turtle attempts the slope, slips back; builder lowers to investigate.
    settle(first,.8,.6);settle(second,-1.35,-.75,1.5,2.5);move(second?.root,{x:-.7,y:.42,z:-.75},4.3,2);rotate(second?.root,{z:.12},5.5,.7);move(second?.root,{x:-1.25,y:0,z:-.75},6.6,1);settle(first,-.5,.05,8,2);crouch(first,10.2);reach(tl,first,11,{bend:.55});stand(first,13.3);break;
   case 2: // A listening circle, then flatten and lengthen the proposed span.
    settle(first,-.85,.65);settle(second,.8,.65,1.4,2);settle(a[2],0,1.1,1.6,2);face(first,1,4);nod(second,4.8);face(first,0,6);nod(a[2],6.8);reach(tl,first,8,{bend:.12});scale(bridge,{x:1.12,y:.68,z:1.1},9,2);a.forEach((v,j)=>look(tl,v,11.5+j*.3,j?-.45:.45));break;
   case 3: // Adjust sections, then let the turtle traverse the gentler model.
    scale(bridge,{y:.7,z:1.15},1.2,.8);settle(first,.6,.25);reach(tl,first,3.6,{repeat:3});bridge?.children.filter((_,j)=>j<12&&j%3===0).forEach((part,j)=>tl.from(part.position,{y:1.7,duration:.6,immediateRender:false},3.5+j*.7));settle(second,-1.35,-.75,5,2);move(second?.root,{x:0,y:.38,z:-.75},7.3,2.7);move(second?.root,{x:1.3,y:0,z:-.75},10,2.8);nod(first,13);break;
   case 4: // Yield on the platform rather than colliding in the center.
    settle(first,-1.45,-.75,1.2,2);settle(second,1.45,-.75,1.4,2);settle(a[2],-1.8,.2,1.8,2);move(first.root,{x:0,y:.58,z:-.75},3.5,2);move(first.root,{z:-1},5.5,.5);move(second?.root,{x:0,y:.58,z:-.55},6.2,2);move(second?.root,{x:-1.45,y:0,z:-.75},8.2,2);move(first.root,{x:1.45,y:0,z:-.75},8.8,2);move(a[2]?.root,{x:0,y:.58,z:-.75},10.4,2);move(a[2]?.root,{x:1.45,y:0,z:-.75},12.5,2.4);break;
   case 5: // Inspect the bridge, clear the path, record the next improvement.
    settle(first,-1,-.1);reach(tl,first,3.6,{repeat:2});settle(second,-1.2,-.75,4,2);move(second?.root,{x:0,y:.58,z:-.75},6.3,2.7);crouch(first,7.5);reach(tl,first,8,{bend:.5,repeat:2});stand(first,10);openBook(10.4);write(first,11.2,4);nod(second,13.5);break;
  }return true;
 }
 if(c.storyId==='shadow-takes-a-day-off'){
  switch(i){
   case 0: // Child checks both sides of her feet before searching the garden.
    settle(first,-.6,.6,1.2,1.5);crouch(first,3);look(tl,first,4,-.8);look(tl,first,5.5,.8);stand(first,7);settle(first,.75,.25,7.8,2);face(first,-.7,10);reach(tl,second,10.8,{bend:.1});nod(first,12.5);break;
   case 1: // Dance for the absent shadow, then sit with the gardener's question.
    settle(first,-.6,.7);rotate(first.root,{y:Math.PI*2},3.5,2);hop(tl,first,4,.17);look(tl,first,6.2,.9);settle(second,.6,.8,6.5,1.8);crouch(first,8.8);face(first,.6,10);nod(second,11);stand(first,13);break;
   case 2: // Shadow draws slowly; the child approaches then stops to watch.
    settle(second,.65,-.1);write(second,3.5,7);settle(first,-.8,.7,3.7,2.5);arm(first,-.7,6.5,.4,0);arm(first,0,7.5,.4,0);crouch(first,8.2);face(first,.55,9);write(second,10,5);stand(first,13);break;
   case 3: // Two separate wish lists, then point to their shared walking time.
    settle(first,-.85,.4);settle(second,.85,.4,1.4,2);write(first,3.7,5);write(second,4.6,5);face(first,.7,7.8);face(second,-.7,7.8);reach(tl,first,8.5,{bend:.1});reach(tl,second,9.5,{bend:.1});settle(first,-.5,1.1,11,1.8);settle(second,.5,1.1,11,1.8);nod(first,13.2);break;
   case 4: // Child practices footwork independently while the shadow sketches.
    settle(first,-1,.7);settle(second,1,-.05,1.4,2);for(let n=0;n<3;n++){settle(first,n%2?-1.2:-.65,.8,3.8+n*2.3,1.2);if(first.legs[0])tl.to(first.legs[0].rotation,{x:-.8,duration:.3,repeat:1,yoyo:true},5+n*2.3);}write(second,4,7);write(second,9,5);look(tl,first,12.6,.4);break;
   case 5: // Exchange discoveries and walk side by side without identical steps.
    settle(first,-.8,.7);settle(second,.8,.7,1.6,2);reach(tl,second,4,{bend:.1});nod(first,5.2);reach(tl,first,6.5,{bend:.1});nod(second,7.5);settle(first,-.4,-.25,9,3.2);settle(second,.55,-.25,9.4,3.2);face(first,.35,13);face(second,-.35,13);break;
  }return true;
 }
 if(c.storyId==='seed-library-notebook'){
  const pot=p('pot');
  switch(i){
   case 0: // Librarian opens the ledger, borrower signs then collects seeds.
    settle(first,-.55,.45);settle(second,.65,.35,1.5,2);openBook(3.8);reach(tl,second,4.3,{bend:.15});write(first,5.8,5);reach(tl,first,8.4,{bend:.45});move(p('beans'),{x:-.55,y:.45,z:.6},8.8,1);settle(first,-1.3,1.2,11,2);move(p('beans'),{x:-1.3,y:.45,z:1.35},11,2);break;
   case 1: // Overwatering is followed by looking under the pot, not celebrating.
    settle(first,-.6,-.05);reach(tl,first,3.5,{repeat:3});move(e.water,{y:.85},4,2);settle(second,.7,-.05,5.5,2);crouch(second,8);rotate(pot,{z:-.15},8.3,1);crouch(first,9.5);look(tl,first,10.5,.5);rotate(pot,{z:0},12,1);stand(first,13);break;
   case 2: // Bring the failed pot, inspect its base, document what happened.
    move(pot,{x:-.7,z:.5},1.3,1);settle(first,-.8,.8);settle(second,.65,.5,1.7,2);reach(tl,second,4,{bend:.5});rotate(pot,{z:.22},4.4,1);nod(first,6);rotate(pot,{z:0},7,.8);openBook(8);write(first,9,7);nod(second,12.8);break;
   case 3: // Seedling leans toward light, then the pot moves and stem straightens.
    settle(first,-.75,.3);settle(second,.8,.35,1.5,2);scale(e.plant,{y:.35},1.2,.1);scale(e.plant,{y:1},3,3);rotate(e.plant,{z:-.35},5.8,1);crouch(second,6.5);reach(tl,first,7.5,{bend:.25});move(pot,{x:.65},8,2);move(e.plant,{x:.65},8,2);rotate(e.plant,{z:0},10,1.4);write(first,11.5,4);stand(second,12.5);break;
   case 4: // Inspect bloom, carefully harvest, label the small packet.
    settle(first,-.55,.15);crouch(first,3.5);look(tl,first,4.5,.35);stand(first,6);reach(tl,first,6.8,{bend:.15,repeat:2});openBook(8.8);write(first,9.5,5);settle(second,.65,.55,9.8,2);face(first,.5,12);nod(second,13);break;
   case 5: // Return seeds, open the shared record and add the drainage drawing.
    settle(first,-.6,.35);settle(second,.6,.4,1.5,2);openBook(3.8);reach(tl,first,4.5,{bend:.2});write(second,6,6);look(tl,first,7.5,.55);reach(tl,first,9.5,{bend:.1});nod(second,11);settle(first,-1.1,1.15,12,1.7);settle(second,.85,1.15,12.2,1.7);break;
  }return true;
 }
 if(c.storyId==='clock-with-a-breath'){
  const hand=e.hand;
  switch(i){
   case 0: // Rush from clock to book and back without finishing either.
    rotate(hand,{z:-Math.PI*3},1.2,10);settle(first,-.5,-.1,1.3,1.4);reach(tl,first,3,{bend:.08});settle(first,.9,.7,4.1,1.3);write(first,5.7,2);settle(first,-.55,-.1,7.1,1.3);reach(tl,first,8.7,{bend:.1});crouch(first,10.2);settle(second,.55,.6,10.8,1.5);nod(second,12.8);break;
   case 1: // Stop the dial but let the sun continue across the sky.
    settle(first,-.5,-.1);settle(second,.75,.2,1.5,2);rotate(hand,{z:-Math.PI},1.3,3);reach(tl,first,4.4,{bend:.08});move(p('sun'),{x:1.8,y:1.55},4.8,5);look(tl,first,8,.7);look(tl,second,9,.45);face(first,.7,11);nod(second,12);break;
   case 2: // Put the activity down, sit, share a snack, then straighten refreshed.
    settle(first,-.55,.6);write(first,3.5,3);crouch(first,5.3);settle(second,.45,.6,5.5,1.7);move(p('basket'),{x:.05,z:.8},7.3,1);reach(tl,first,8.6,{bend:.15});reach(tl,second,9.6,{bend:.12});stand(first,11.3);nod(first,12.5);hop(tl,second,13.5,.1);break;
   case 3: // Edit the schedule in two deliberate bursts, leaving a real pause.
    settle(first,-.6,.4);settle(second,.65,.55,1.6,2);openBook(3.8);write(first,4.6,3);rotate(hand,{z:-Math.PI*.6},4.6,1.4);look(tl,first,7,.55);nod(second,8.1);write(first,10,3);reach(tl,first,12,{bend:.08});face(first,.55,13.2);break;
   case 4: // Watch the rain from shelter, then approach the flowers together.
    settle(first,-.45,.85);settle(second,.45,.85,1.5,2);face(first,.25,4);face(second,-.25,4);crouch(first,5);nod(second,6);stand(first,7.5);settle(first,-.7,-.05,8.5,2.8);settle(second,.7,.05,8.9,2.8);crouch(first,11.6);crouch(second,12.2);stand(first,14);stand(second,14.2);break;
   case 5: // Return the borrowed clock, show the new plan and leave unhurriedly.
    settle(first,-.6,.3);settle(second,.65,.3,1.4,2);reach(tl,first,3.7,{bend:.1});move(p('clocktower'),{x:.45},4.3,1.4);reach(tl,second,5.9,{bend:.1});nod(first,7);settle(first,-1.15,.9,8.5,2.5);look(tl,first,11,-.6);crouch(first,12);stand(first,13.7);break;
  }return true;
 }
 if(c.storyId==='paper-boat-map'){
  const boat=e.boat;
  // A paper boat remains small enough for the child to launch and retrieve.
  if(boat)tl.set(boat.scale,{x:.55,y:.55,z:.55,immediateRender:true},0);
  switch(i){
   case 0: // Launch straight, current redirects it, stop visibly at an obstruction.
    settle(first,-1,.55);reach(tl,first,3.5,{bend:.5});move(boat,{x:-.8,z:-.2},3.7,.7);move(boat,{x:.35,z:-.65},4.6,2.5);rotate(boat,{y:.9},6.5,.9);move(boat,{x:.95,z:-.2},7.4,1.4);look(tl,first,9.3,.8);settle(second,.95,.7,10,2);crouch(first,12);break;
   case 1: // Two failed pushes, hull tips, duck assists in retrieval.
    settle(first,-.6,.35);move(boat,{x:.45,z:-.15},1.3,1);reach(tl,first,3.7,{repeat:2});move(boat,{x:-.15},4.2,1);move(boat,{x:.7},5.3,1.3);rotate(boat,{z:.2},6.5,.7);settle(second,.8,.05,6.8,2);reach(tl,second,9,{bend:.35});move(boat,{x:-.65,y:.4,z:.5},9.3,1.8);reach(tl,first,11.3,{bend:.3});move(boat,{x:-1.35,y:.28,z:.25},12,1.2);break;
   case 2: // Follow the bends on foot, inspect the eddy, sketch a curved map.
    settle(first,-1.1,.3);settle(second,-.3,-.35,1.6,2);settle(second,.7,-.55,4,2);settle(first,.45,.4,4.3,2);rotate(second?.root,{y:Math.PI*2},6.4,1.5);crouch(first,7);look(tl,first,8.2,.6);stand(first,9.5);write(first,10.3,6);break;
   case 3: // The second boat circles in an eddy and leaves without being pushed.
    settle(first,-1,.55);settle(second,1.25,.55,1.4,2);reach(tl,first,3.7,{bend:.35});move(boat,{x:-.85,z:-.2},3.9,.7);move(boat,{x:.25,z:-.45},4.7,2);rotate(boat,{y:Math.PI*4},6.7,3.2);move(boat,{x:.5,z:-.3},6.7,1.4);move(boat,{x:.25,z:-.45},8.1,1.8);move(boat,{x:1.05,z:.15},10.2,2.5);nod(first,12.8);reach(tl,second,13.3,{bend:.3});break;
   case 4: // Wait at the blocked inlet, then duck steers the boat toward the bank.
    move(boat,{x:.15,z:-.35},1.3,2);settle(first,-.9,.7);settle(second,1,.1,1.6,2);rotate(boat,{z:.06},3.4,.6);rotate(boat,{z:-.06},4.2,.6);look(tl,first,5,-.8);nod(first,6.5);move(boat,{x:.8,z:.15},7,2);reach(tl,second,9.2,{bend:.3});move(boat,{x:-.6,z:.55},9.6,1.8);reach(tl,first,11.5,{bend:.5});move(boat,{x:-.65,y:.65,z:.65},12.1,1);break;
   case 5: // Dry and place the boat beside the map, then compare new conditions.
    settle(first,-.65,.45);settle(second,.75,.4,1.5,2);move(boat,{x:-.4,y:.65,z:.65},3.7,1);rotate(boat,{y:.6},4.8,1);openBook(6);move(boat,{x:.65,y:.65,z:.5},7.2,1);write(first,8.6,5);look(tl,second,9.5,-.55);nod(first,11.8);nod(second,13);break;
  }return true;
 }
 if(c.storyId==='cloud-tailor-pockets'){
  const cloud=e.pocketCloud,rain=e.rain;
  // Rain belongs only to the chapter where the pocket is intentionally opened.
  if(rain)tl.set(rain.scale,{x:.001,y:.001,z:.001,immediateRender:true},0);
  switch(i){
   case 0: // Inspect cloth, measure around the cloud and begin stitching pockets.
    settle(first,-.55,.05);settle(second,.8,.3,1.5,2);reach(tl,first,3.6,{repeat:2});move(cloud,{y:1.25,x:.25},4.1,1);rotate(cloud,{y:.5},5.7,1);write(first,7,7);reach(tl,second,9.8,{bend:.1});look(tl,first,11.7,.5);rotate(cloud,{y:0},12.3,1);break;
   case 1: // The loaded cloud sags; the wind strains but cannot lift it.
    move(cloud,{y:.7},1.5,3);scale(cloud,{x:1.18,y:.8,z:1.05},2,2.5);settle(first,-.7,.2);settle(second,.8,.15,1.8,2);arm(second,-1,4.2,.25,7);move(e.sway,{x:.75},4.2,2);move(cloud,{x:.15,y:.76},5.5,1);move(cloud,{x:0,y:.7},7,.8);rotate(first.root,{z:-.08,x:.15},8.5,.6);reach(tl,first,10,{bend:.35});arm(second,0,11,.4,0);nod(first,12.3);break;
   case 2: // Empty the water first, remove pockets, and test the lighter fit.
    move(cloud,{y:.9},1.3,1);settle(first,-.6,.1);settle(second,.8,.25,1.5,2);rotate(cloud,{z:.25},3.7,1);move(e.water,{y:.78},4,2);rotate(cloud,{z:0},6.3,.8);write(first,7.2,5);scale(cloud,{x:.9,y:1,z:1},8.5,1.5);move(cloud,{y:1.8},10,2);nod(second,12);hop(tl,first,13,.12);break;
   case 3: // Turn one pocket toward the plants and make a gentle, bounded shower.
    settle(first,-.8,.6);settle(second,.85,.55,1.5,2);move(cloud,{x:-.6,y:1.8,z:-.6},3.5,1.5);reach(tl,first,5.3,{bend:.12});scale(rain,{x:.75,y:1,z:1},5.7,.3);if(rain)tl.fromTo(rain.position,{x:-.6,y:1.7,z:-.6},{x:-.6,y:.2,z:-.6,duration:1.3,repeat:3,ease:'none',immediateRender:false},6);move(cloud,{x:.5},6,5);move(rain,{x:.5},6,5);arm(second,-.65,7,.35,3);scale(rain,{x:.001,y:.001,z:.001},11.3,.3);write(first,12,4);break;
   case 4: // An empty cloud becomes shade: move beneath the sun and hold still.
    settle(first,-.85,.8);settle(second,.8,.8,1.4,2);move(cloud,{x:1.1,y:1.8,z:-.8},2.5,2);look(tl,first,4.8,.65);reach(tl,second,5.8,{bend:.1});move(cloud,{x:0,y:1.6,z:-.1},6.7,2.5);settle(first,-.45,.25,9.5,1.8);settle(second,.45,.25,9.8,1.8);nod(first,12);move(cloud,{x:-1.25,y:1.9,z:-.8},13,2);break;
   case 5: // Save the spare cloth, record a revised design, release the fitted cloud.
    settle(first,-.65,.25);settle(second,.75,.3,1.5,2);reach(tl,first,3.7,{repeat:2});openBook(5.8);write(first,6.6,6);nod(second,8.5);move(cloud,{x:.8,y:2,z:-1.1},10.3,2.6);look(tl,first,11.4,.6);reach(tl,first,13,{bend:.08});break;
  }return true;
 }
 if(c.storyId==='bakery-under-the-stars'){
  const bread=e.bread;
  switch(i){
   case 0: // Baker returns for a forgotten item and finds the night worker waiting.
    scale(bread,{x:.001,y:.001,z:.001},0,0);settle(first,-.55,-.1,1.2,2);reach(tl,first,3.5,{bend:.35});settle(second,1.2,.85,2,3);look(tl,first,5.5,.9);settle(first,-.1,.8,7,1.5);face(first,1,9);face(second,-1,9);nod(first,11);nod(second,12.5);break;
   case 1: // Exhausted kneading stops; friends intervene and the baker rests.
    settle(first,-.55,.35);reach(tl,first,3.5,{repeat:3});rotate(first.root,{x:.45,z:-.1},6.4,1);move(first.root,{y:-.12},6.4,1);settle(second,.5,.65,5.5,2);settle(a[2],1.2,.25,6,2);reach(tl,a[2],8.3,{bend:.1});arm(first,0,9,.5,0);face(second,-.8,10);nod(second,11);stand(first,12.5);break;
   case 2: // Compare three schedules, select their shared window, write orders.
    scale(bread,{x:.001,y:.001,z:.001},0,0);settle(first,-.75,.55);settle(second,0,1,1.4,2);settle(a[2],.8,.55,1.6,2);openBook(3.8);write(first,4.6,4);nod(second,6.8);reach(tl,a[2],8,{bend:.1});rotate(e.hand,{z:-Math.PI*.7},8.5,1.4);write(first,10.4,5);nod(a[2],13);break;
   case 3: // Knead, let the dough rise, label the batch, then hand over the order.
    settle(first,-.55,.4);scale(bread,{x:.7,y:.5,z:.7},1.2,.1);reach(tl,first,3.5,{repeat:3});scale(bread,{x:1,y:1.35,z:1},5.5,2.2);scale(bread,{x:1,y:1,z:1},8,.6);write(first,8.7,3);settle(second,.7,.65,8.8,2);move(bread,{x:.5,y:.6,z:.75},10.8,1.3);reach(tl,second,12.3,{bend:.12});nod(first,13.5);break;
   case 4: // Take an order, update the posted hours, close after final collection.
    settle(first,-.55,.4);settle(second,.65,.6,1.5,2);write(first,3.8,4);reach(tl,first,6,{bend:.1});move(bread,{x:.6,y:.6,z:.85},6.5,1);reach(tl,second,7.7,{bend:.15});settle(second,.55,-.05,9,1.5);reach(tl,second,10.8,{bend:.08});settle(first,-.8,1.05,11.7,1.8);move(bread,{x:.7,y:.6,z:1.3},12.3,1.4);nod(first,14);break;
   case 5: // Two different workdays diverge: delivery bird departs, baker goes home.
    settle(first,-.5,.7);settle(second,.6,.7,1.5,2);move(bread,{x:.6,y:.55,z:1},3.7,.8);reach(tl,second,4.6,{bend:.15});nod(first,6);nod(second,7);move(second?.root,{x:1.5,y:1.3,z:-1.1},8.5,3.4);move(bread,{x:1.5,y:1.85,z:-.8},8.5,3.4);flap(second,8.5,3.5);settle(first,-1.4,1.05,9,3);look(tl,first,12.5,.7);break;
  }return true;
 }
 if(c.storyId==='orchestra-of-small-sounds'){
  const drum=e.drum,mouse=a.find(v=>v.type==='mouse'),bird=a.find(v=>v.type==='rooster');
  const beat=(actor,t,count=4,loud=false)=>{arm(actor,loud?-1.4:-.72,t,loud?.16:.28,count*2-1);if(actor===first&&drum)tl.to(drum.scale,{y:loud?.86:.97,duration:loud?.16:.28,repeat:count*2-1,yoyo:true},t);};
  switch(i){
   case 0: // Loud drum overwhelms the smaller stones; mouse stops participating.
    settle(first,-.6,.2);settle(mouse,.5,.7,1.5,2);settle(bird,1.15,.3,1.7,2);beat(first,3.9,10,true);arm(bird,-.8,4.2,.24,13);beat(mouse,4.8,3);arm(mouse,0,7,.3,0);crouch(mouse,8.3);look(tl,first,10,.7);face(bird,-.5,11);stand(mouse,13);break;
   case 1: // Heavy stones tire the mouse; the group notices when it starts leaving.
    settle(first,-.65,.25);settle(mouse,.5,.65,1.4,2);settle(bird,1.2,.3,1.6,2);beat(mouse,3.8,5,true);rotate(mouse?.root,{x:.3},5.8,.8);arm(mouse,0,6.5,.4,0);settle(mouse,1.55,1.15,7.5,2.4);face(first,.8,9.5);face(bird,.8,9.5);reach(tl,bird,10.3,{bend:.1});face(mouse,-.9,11.5);nod(mouse,12.5);break;
   case 2: // Listen first, then introduce drum, stones and voice one at a time.
    settle(first,-.65,.2);settle(mouse,.45,.7,1.4,2);settle(bird,1.15,.2,1.6,2);a.forEach(v=>arm(v,0,3.8,.3,0));look(tl,first,4.8,-.5);look(tl,mouse,5.3,.4);beat(mouse,6.5,2);nod(first,7.8);beat(first,8.5,2);beat(mouse,10,2);arm(bird,-.55,11.5,.3,3);break;
   case 3: // Write the score, rehearse a false entry, reset and use the new cue.
    settle(first,-.6,.2);settle(mouse,.45,.7,1.4,2);settle(bird,1.2,.25,1.6,2);openBook(3.7);write(mouse,4.4,4);beat(first,6.7,2);arm(bird,-.8,7,.2,1);a.forEach(v=>arm(v,0,8,.2,0));nod(mouse,8.5);beat(first,9.7,2);beat(mouse,11.1,2);arm(bird,-.6,12.6,.3,3);break;
   case 4: // Perform, pause together when a page blows over, then resume in order.
    settle(first,-.6,.2);settle(mouse,.4,.7,1.4,2);settle(bird,1.2,.25,1.6,2);beat(first,3.8,2);beat(mouse,5.1,2);arm(bird,-.65,6.4,.28,3);{const page=p('books')?.children.at(-1);rotate(page,{x:-.8,y:.8},7.6,.6);a.forEach(v=>arm(v,0,8.2,.25,0));reach(tl,mouse,8.7,{bend:.35});rotate(page,{x:0,y:0},9.3,.6);}nod(first,10.1);beat(first,10.8,2);beat(mouse,12.1,2);arm(bird,-.6,13.4,.25,3);break;
   case 5: // One quiet encore, bow to each other, pack up and listen while leaving.
    settle(first,-.65,.3);settle(mouse,.35,.7,1.4,2);settle(bird,1.15,.3,1.6,2);beat(mouse,3.9,2);nod(first,5.5);nod(bird,6.7);reach(tl,mouse,8,{bend:.45});move(drum,{x:-.55,y:.3,z:.6},8.5,1);settle(first,-1.2,1.05,10,2.5);move(drum,{x:-1.15,y:.3,z:1.2},10,2.5);settle(mouse,.15,1.2,10.4,2.5);settle(bird,1.2,1.05,10.8,2.5);look(tl,first,13.2,-.4);look(tl,mouse,13.8,.4);break;
  }return true;
 }
 return false;
}
