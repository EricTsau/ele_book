// Sound markers use the same finite clock as the choreography. They are data,
// never timeline callbacks: paused seeks must not produce audio on their own.
export function motionSound(timeline,type,time){
 timeline.data??={};(timeline.data.motionSounds??=[]).push({type,time});
}

// Overrides name the physical event, with times checked against the owning
// motion module. An empty override deliberately leaves a quiet conversation.
const actions={
 'three-little-pigs':{
  1:[[3.45,'rustle'],[6.15,'rustle'],[8.85,'rustle'],[11.55,'rustle']],
  2:[[3.45,'knock'],[6.15,'knock'],[8.85,'knock'],[11.55,'knock']],
  3:[[3.45,'stone'],[6.15,'stone'],[8.85,'stone'],[11.55,'stone']],
  4:[[4,'knock'],[4.6,'knock'],[7.6,'wind'],[8.65,'crumble'],[9.5,'step'],[9.9,'step'],[10.3,'step']],
  5:[[4,'knock'],[4.6,'knock'],[7.6,'wind'],[8.65,'crack'],[9.2,'crumble'],[10.6,'step'],[11,'step'],[11.4,'step']],
  6:[[4,'knock'],[4.6,'knock'],[7.6,'wind'],[11.4,'step'],[11.9,'step'],[12.4,'step']],
 },
 'red-riding-hood':{0:[[2,'rustle']],2:[[0,'cloth']],5:[[5,'rustle']]},
 'ugly-duckling':{0:[[1.5,'tap'],[2.2,'tap'],[3.4,'crack']],3:[[5,'wind']],5:[[10,'flutter'],[12.6,'splash']]},
 'jack-and-beanstalk':{0:[[8.9,'tap']],1:[[4,'rustle'],[6,'rustle']],2:[[4,'rustle'],[6,'rustle'],[8,'rustle']],3:[[4.2,'jingle'],[6,'creak'],[9,'bell']],4:[[10,'rustle'],[11.8,'crack']],5:[[5,'rustle']]},
 'goldilocks':{1:[[4.4,'sip'],[8.4,'sip'],[11.9,'sip']],2:[[6.8,'creak'],[8,'crack'],[8.9,'thud']],3:[[2,'cloth'],[11,'cloth']],5:[[.6,'knock'],[1.4,'knock'],[4,'knock'],[4.5,'knock']]},
 'hansel-and-gretel':{1:[[4.4,'crunch'],[8.4,'crunch']],3:[[5.4,'scrape'],[6.2,'scrape'],[7,'scrape']],4:[[5,'jingle'],[6.5,'creak']],5:[[4.5,'rustle']]},
 'puss-in-boots':{0:[[6,'cloth'],[8,'cloth']],3:[[7,'sparkle']],4:[[5,'cloth'],[9,'cloth']]},
 'cinderella':{0:[[4.4,'scrape'],[5.2,'scrape'],[6,'scrape']],1:[[5,'sparkle'],[6.3,'chime']],3:[[0,'bell'],[1.5,'bell'],[3,'bell'],[7.5,'jingle'],[8,'sparkle']],4:[[8.8,'jingle']]},
 'thumbelina':{0:[[1.5,'rustle']],1:[[6,'water'],[8,'water'],[10,'water']]},
 'lion-and-mouse':{3:[[2,'cloth'],[4.5,'creak']],4:[[4.4,'scrape'],[5.2,'scrape'],[6,'scrape'],[7,'snap'],[8.5,'cloth']]},
 'north-wind-and-sun':{1:[[2,'wind'],[5,'wind'],[4.8,'cloth']],2:[[2,'wind'],[5,'wind'],[4.8,'cloth']],4:[[6.3,'cloth']],5:[[2.3,'cloth']]},
 'fox-and-grapes':{1:[[6.3,'thud'],[10.3,'thud']],2:[[6.3,'thud'],[10.3,'thud']]},
 'town-and-country-mice':{0:[[5.4,'crunch'],[8.4,'crunch']],2:[[2.4,'crunch'],[5.4,'crunch']],3:[[3.4,'thud']],5:[[5.4,'crunch'],[6.2,'crunch']]},
 'ant-and-dove':{0:[[4.7,'splash'],[6,'water']],1:[[5.6,'splash']],2:[[2,'water'],[4,'water'],[6,'water']]},
 'sweet-porridge':{1:[[3,'bubble'],[4.5,'bubble']],2:[[3,'bubble'],[5,'pour'],[6,'pour']],3:[[3,'bubble'],[5,'pour'],[7,'pour'],[9,'pour']],4:[[1.5,'pour'],[3,'pour']],5:[[2.4,'scrape'],[3.4,'scrape'],[4.4,'scrape']]},
 'star-money':{2:[[3,'cloth'],[6,'cloth']],3:[[3,'cloth']],4:[[3,'sparkle'],[4.6,'jingle'],[5.3,'jingle'],[6,'jingle'],[6.7,'jingle'],[7.4,'jingle'],[10.8,'jingle'],[12,'jingle']]},
 'emperors-new-clothes':{1:[[2.4,'tap'],[3.2,'tap'],[4,'tap'],[4.8,'tap']],2:[[2.4,'tap'],[3.2,'tap'],[4,'tap'],[4.8,'tap']]},
 'princess-and-pea':{0:[[8,'knock']],1:[[2,'rain']],2:[[5,'cloth'],[6.4,'cloth'],[7.8,'cloth'],[9.2,'cloth'],[10.6,'cloth']],3:[[2,'cloth'],[4.2,'cloth'],[6.4,'cloth'],[8.6,'cloth']],4:[[5,'cloth'],[6,'cloth'],[8,'cloth'],[10,'cloth']]},
 'lantern-with-many-windows':{0:[[1.3,'wind'],[2,'crack'],[4,'rustle']],1:[[4.4,'paper'],[6.4,'paper'],[8.4,'paper']],2:[[4.4,'paper'],[6.2,'snip'],[6.8,'paper'],[8.6,'chime']],5:[[6.3,'paper'],[11.3,'chime']]},
 'rain-post-office':{0:[[3.9,'paper'],[9,'paper']],1:[[7,'paper']],2:[[3.3,'paper'],[9,'paper']],3:[[7,'paper'],[11,'knock']],4:[[1.2,'paper'],[4.5,'paper']],5:[[10.5,'paper']]},
 'shadow-takes-a-day-off':{2:[[5,'paper']],3:[[7,'paper']],4:[[5,'scrape'],[7.3,'scrape'],[9.6,'scrape']]},
 'seed-library-notebook':{0:[[3.8,'paper']],1:[[4,'pour']],2:[[4.4,'tap'],[9,'paper']],3:[[4.2,'pour']],4:[[7.5,'paper']],5:[[4.8,'paper']]},
 'clock-with-a-breath':{0:[[3,'clock'],[8.7,'clock']],1:[[4.4,'clock']],2:[[8.6,'clock']],3:[[5,'paper']],5:[[4.3,'clock']]},
 'paper-boat-map':{0:[[3.9,'splash']],1:[[4.2,'water'],[11.1,'paper']],2:[[11.3,'paper']],3:[[4.7,'water'],[10.2,'splash']],4:[[6,'paper'],[12.1,'splash']],5:[[3.7,'paper'],[8.6,'paper']]},
 'cloud-tailor-pockets':{0:[[3.2,'cloth'],[5.6,'cloth'],[6.4,'cloth'],[8.6,'cloth']],1:[[4.2,'wind']],2:[[4,'water'],[6.3,'cloth']],3:[[6,'rain'],[8.6,'rain']],4:[[6.7,'wind']],5:[[5,'cloth'],[10.3,'wind']]},
 'bakery-under-the-stars':{0:[[3.5,'thud']],1:[[4,'thud']],2:[[8.5,'thud']],3:[[4,'thud'],[8.2,'bell'],[12.2,'paper']],4:[[7.6,'paper'],[13,'tap']],5:[[3.7,'paper'],[8.5,'paper']]},
};
export function actionSounds(chapter){
 const override=actions[chapter.storyId]?.[chapter.storyIndex];
 return override?override.map(([time,type])=>({time,type})):(chapter.soundCues||[]).filter(c=>c.type!=='step');
}
