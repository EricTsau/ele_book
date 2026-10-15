// Hand-authored anchors in classicEvent's scene-time coordinates (seconds).
// Narration follows source sentence order; dialogue joins its related beat.
// Repeated anchors deliberately hold exposition before the next visible action.
export const speechCuesClassics = {
 // Wind: pulling the coat tight, sheltering, warming, and removing it are separate beats.
 'north-wind-and-sun:story:0':{narration:[0,6.4,7,8,9],lines:[1.4,4]},
 'north-wind-and-sun:story:1':{narration:[0,2,4.8,5.5,7],lines:[4.8,6.5]},
 'north-wind-and-sun:story:2':{narration:[0,2,9,12,13,14],lines:[9,13]},
 'north-wind-and-sun:story:3':{narration:[0,2,3.5,4,10,11.4],lines:[4,10]},
 'north-wind-and-sun:story:4':{narration:[0,5,6.3,8,9],lines:[6.3,10]},
 'north-wind-and-sun:story:5':{narration:[0,1.2,1.4,9,11.4],lines:[3,10]},
 // Crow: each stone falls at 3.52/7.12/10.72; water rises at 4.05/7.65/11.25.
 'thirsty-crow:story:0':{narration:[0,1.4,5.4,5.5,6,6.3],lines:[1.4,6.3]},
 'thirsty-crow:story:1':{narration:[0,4.5,7,9,10],lines:[5.3,10]},
 'thirsty-crow:story:2':{narration:[0,6,7,9.5,10],lines:[6.8,10]},
 'thirsty-crow:story:3':{narration:[0,3.52,4.05,5,7.65],lines:[1.4,4.6]},
 'thirsty-crow:story:4':{narration:[0,1.4,4.6,5,11.25,12.2],lines:[5,8.6]},
 'thirsty-crow:story:5':{narration:[0,7.4,10,13,14],lines:[6.6,13.5]},
 // Grapes stay above reach at both jumps; recovery and departure follow.
 'fox-and-grapes:story:0':{narration:[0,1.4,4.4,5,8],lines:[5,8]},
 'fox-and-grapes:story:1':{narration:[0,5.9,6.3,9.5,10.3,12],lines:[7,9.5]},
 'fox-and-grapes:story:2':{narration:[0,4,8,12,13,14],lines:[7,12]},
 'fox-and-grapes:story:3':{narration:[0,5.6,6,7.6,9.2,10],lines:[6,8]},
 'fox-and-grapes:story:4':{narration:[0,6,6.4,8,10],lines:[4.4,8]},
 'fox-and-grapes:story:5':{narration:[0,4.4,4.8,5,13],lines:[4.5,10]},
 // Mice: eating precedes the alarm, shelter precedes the cat's approach.
 'town-and-country-mice:story:0':{narration:[0,2,5,7.5,8,9.6],lines:[5,9.6]},
 'town-and-country-mice:story:1':{narration:[0,1,1.5,2,7.5],lines:[1,1.5]},
 'town-and-country-mice:story:2':{narration:[0,1,1.5,2,5,10],lines:[3.6,10]},
 'town-and-country-mice:story:3':{narration:[0,3.4,3.6,4,4.5,7.5],lines:[2,3.6]},
 'town-and-country-mice:story:4':{narration:[0,3,5,7],lines:[5,9]},
 'town-and-country-mice:story:5':{narration:[0,4.5,5,10,11,12],lines:[5,12]},
 // Rescue: falling, leaf landing, shore, ankle bite, and escape remain causal.
 'ant-and-dove:story:0':{narration:[0,1.5,3.5,3.6,4],lines:[1.5,5]},
 'ant-and-dove:story:1':{narration:[0,1.4,3.4,3.4,3.6],lines:[1.4,5.6]},
 'ant-and-dove:story:2':{narration:[0,0.5,1,2,8,11],lines:[1,7]},
 'ant-and-dove:story:3':{narration:[0,1,2,4,7,8],lines:[7,8]},
 'ant-and-dove:story:4':{narration:[0,1.5,5.4,6,10],lines:[5.4,6]},
 'ant-and-dove:story:5':{narration:[0,6,9,10.4,12],lines:[6,9]},
 // Musicians: stacking completes before the chorus scares the thieves away.
 'bremen-musicians:story:0':{narration:[0,1.5,4,6,9],lines:[6,9.4]},
 'bremen-musicians:story:1':{narration:[0,4.5,6.7,8.9,10],lines:[6.7,7.8]},
 'bremen-musicians:story:2':{narration:[0,1.5,6,10,10.8,11.5],lines:[5,11.5]},
 'bremen-musicians:story:3':{narration:[0,8,8.5,9.3,12],lines:[7.6,8.12]},
 'bremen-musicians:story:4':{narration:[0,2.5,6,9,10.5],lines:[6.6,7.8]},
 'bremen-musicians:story:5':{narration:[0,4.8,6.4,9,10],lines:[9,10]},
 // Porridge's start/stop spell is heard on the corresponding water beat.
 'sweet-porridge:story:0':{narration:[0,1.4,4,5],lines:[4,5]},
 'sweet-porridge:story:1':{narration:[0,6,7,8.4,10],lines:[3,7]},
 'sweet-porridge:story:2':{narration:[0,3,7.5,10,12],lines:[6.8,7.5]},
 'sweet-porridge:story:3':{narration:[0,3,4.8,4.9,5,12],lines:[3,4.8]},
 'sweet-porridge:story:4':{narration:[0,0.7,1.4,4.4,5.5],lines:[2,5.5]},
 'sweet-porridge:story:5':{narration:[0,7,8,11.4,13],lines:[10,12]},
 // Gifts change hands independently; falling silver precedes the new coat.
 'star-money:story:0':{narration:[0,3.5,4,5],lines:[5,7]},
 'star-money:story:1':{narration:[0,4,6.4,10,13],lines:[4,6.4]},
 'star-money:story:2':{narration:[0,1,3,9,11,12.4],lines:[1,3]},
 'star-money:story:3':{narration:[0,3,6,8,12],lines:[6,12]},
 'star-money:story:4':{narration:[0,3,6.5,9,12.6,14.4],lines:[3,8]},
 'star-money:story:5':{narration:[0,5,9,11,12.4],lines:[5,12.4]},
 // The child's announcement happens before the procession resumes.
 'emperors-new-clothes:story:0':{narration:[0,1,2,4,6],lines:[4,6]},
 'emperors-new-clothes:story:1':{narration:[0,3,7,8,10],lines:[7,8]},
 'emperors-new-clothes:story:2':{narration:[0,3,9,11,12.4,13],lines:[9,11]},
 'emperors-new-clothes:story:3':{narration:[0,6,7,10,11.6],lines:[6,12]},
 'emperors-new-clothes:story:4':{narration:[0,5.5,7,8.8,9.15,10],lines:[7,9.5]},
 'emperors-new-clothes:story:5':{narration:[0,6,11.5,12.8,14],lines:[2,4]},
 // Bed layers start at 4.7 and are removed from 6; the pea is revealed last.
 'princess-and-pea:story:0':{narration:[0,2.5,4.5,6,8],lines:[5,8]},
 'princess-and-pea:story:1':{narration:[0,1,1.5,9,9.8,11],lines:[1,1.5]},
 'princess-and-pea:story:2':{narration:[0,3.8,4.7,12.4,13.4],lines:[3.8,4.7]},
 'princess-and-pea:story:3':{narration:[0,1,2,6.4,11],lines:[2,4.2]},
 'princess-and-pea:story:4':{narration:[0,4,5,12.6,13.4],lines:[1.5,4]},
 'princess-and-pea:story:5':{narration:[0,5,6,7],lines:[6,9]},
};
