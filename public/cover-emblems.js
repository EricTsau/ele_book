// Original SVG cover illustrations, assembled from paper-like geometric shapes.
export function coverEmblem(kind,color){
 const ink='#697957',gold='#ddbc71',paper='#f2e7ce',wood='#a48560';
 const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
 const path=(d,c)=>`<path d="${d}" fill="${c}"/>`;
 const rect=(x,y,w,h,c,r=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
 const star=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${path('M0-24 7-7 24 0 7 7 0 24-7 7-24 0-7-7z',gold)}</g>`;
 const cloud=`${circle(264,224,33,paper)}${circle(300,205,40,paper)}${circle(335,228,28,paper)}${rect(244,224,107,28,paper)}`;
 const bird=`<ellipse cx="280" cy="268" rx="40" ry="25" fill="${paper}"/>${circle(313,241,18,paper)}${path('M329 241 351 250 329 256z',gold)}${circle(317,238,3,ink)}${path('M260 260q-42-63-64-49q9 49 58 67z',paper)}`;
 let art='';
 if(kind==='sun')art=circle(278,240,51,gold)+Array.from({length:12},(_,i)=>`<g transform="translate(278 240) rotate(${i*30})">${rect(-4,-82,8,22,gold)}</g>`).join('')+path('M180 324q94-33 190 0v23H180z',wood);
 if(kind==='jar')art=path('M249 205h62v26q40 62 14 99h-91q-28-41 15-99z','#c79a7e')+rect(242,197,77,16,wood)+path('M237 297h89l-5 29h-80z','#8bb6bb')+circle(369,327,11,'#a5ad9a')+circle(390,315,8,'#b6b9a5')+path('M193 220q-34-20-45 2q11 31 43 20z','#596e72')+circle(186,220,12,'#596e72');
 if(kind==='grapes')art=rect(201,169,157,9,wood)+rect(207,174,7,163,wood)+rect(346,174,7,163,wood)+Array.from({length:4},(_,i)=>Array.from({length:4-i},(_,j)=>circle(245+j*22+i*11,218+i*24,16,'#a28baa')).join('')).join('')+path('M279 199q-17-48 26-43q12 25-26 43z',ink);
 if(kind==='city')art=rect(220,186,53,138,'#a6a98b')+rect(286,159,61,165,'#c1b393')+rect(170,233,47,91,'#c09c80')+Array.from({length:6},(_,i)=>rect(299+(i%2)*20,183+Math.floor(i/2)*34,10,17,paper)).join('')+circle(267,327,18,'#9f9884')+circle(256,305,10,'#9f9884')+circle(280,321,3,ink);
 if(kind==='dove')art=bird+path('M279 303q-40 26-76 10',ink)+rect(280,299,5,37,ink)+path('M282 310q35-30 47-8q-16 23-47 8z',ink);
 if(kind==='music')art=rect(214,273,94,58,color)+`<ellipse cx="261" cy="273" rx="47" ry="12" fill="${paper}"/>`+rect(332,180,7,76,ink)+`<ellipse cx="325" cy="258" rx="16" ry="12" fill="${ink}"/>`+path('M335 180q41 4 25 38q-2-20-25-21z',ink)+path('M203 207l48 69 5-4-48-69z',wood)+star(272,192,.7);
 if(kind==='pot')art=path('M218 253h125q0 82-62 82t-63-82z',wood)+`<ellipse cx="281" cy="253" rx="63" ry="14" fill="${gold}"/>`+`<path d="M241 236q-22-18 0-37m36 35q-22-18 0-47m37 47q-22-18 0-37" stroke="${paper}" stroke-width="9" fill="none"/>`;
 if(kind==='star')art=star(280,224,2.2)+star(215,298,.5)+star(359,290,.65)+path('M240 302h80l-12 41h-56z',color)+circle(267,313,8,gold)+circle(290,309,8,gold);
 if(kind==='crown')art=path('M211 241l-7-64 43 32 34-47 36 47 41-32-8 64z',gold)+rect(213,248,135,17,wood)+rect(218,277,126,47,paper)+path('M245 277v47m26-47v47m26-47v47m26-47v47',wood);
 if(kind==='pea')art=Array.from({length:5},(_,i)=>rect(202,219+i*21,158,19,[color,'#d0b994','#a8b994'][i%3])).join('')+rect(211,205,56,13,paper)+circle(279,333,8,ink);
 if(kind==='lantern')art=rect(234,229,94,99,gold)+rect(229,220,104,12,wood)+rect(228,325,106,11,wood)+path('M225 217l57-45 56 45z',color)+rect(243,232,6,92,wood)+rect(312,232,6,92,wood)+star(282,277,.7);
 if(kind==='mail')art=rect(268,267,16,78,wood)+rect(211,205,138,79,color)+rect(230,224,100,8,ink)+rect(246,253,64,42,paper)+path('M246 253l32 24 32-24',gold)+rect(353,197,5,57,wood)+rect(357,195,28,22,'#b67462');
 if(kind==='bridge')art=path('M157 318q126-116 252 0l-9 13q-118-100-234 0z',wood)+`<path d="M157 280q126-117 252 0m-244 0v34m40-62v33m42-51v34m43-37v30m42-20v30m40-8v30" fill="none" stroke="${ink}" stroke-width="6"/>`+path('M171 342q70-29 129-2t105 0v22H171z','#91b4ba');
 if(kind==='moon')art=circle(281,241,63,gold)+circle(311,220,54,'#e7e8d2')+star(220,186,.45)+star(356,291,.55)+path('M213 326l33-58 28 58z',color)+circle(246,260,15,'#b99377');
 if(kind==='seed')art=rect(211,268,143,59,wood)+rect(219,278,126,39,paper)+rect(241,285,81,6,wood)+rect(280,221,6,47,ink)+path('M282 242q-61-55-64-18q30 29 64 18m3-24q61-47 61-15q-23 32-61 15z',ink);
 if(kind==='clock')art=rect(224,223,117,112,wood)+path('M208 221l75-66 73 66z',color)+circle(283,257,35,paper)+`<path d="M283 232v25l21 11" stroke="${ink}" stroke-width="5" fill="none"/>`+rect(277,300,10,27,gold);
 if(kind==='boat')art=path('M185 301h202l-38 39H226z',color)+rect(280,182,5,120,wood)+path('M274 185v109h-71z',paper)+path('M292 205l66 89h-66z',gold)+path('M184 348q36-13 70 0t70 0t70 0v10H184z','#8db6ba');
 if(kind==='cloud')art=cloud+rect(256,284,84,42,color)+`<path d="M291 250q-15 29-2 56" stroke="${wood}" stroke-width="4" stroke-dasharray="5 4" fill="none"/>`+star(354,188,.6)+path('M205 280l39 35-8 5-40-32z',gold);
 if(kind==='bread')art=path('M201 281q0-67 83-67t83 67v44H201z',gold)+`<path d="M238 244l-5 47m50-57-5 57m50-47-5 47" stroke="${paper}" stroke-width="8" stroke-linecap="round"/>`+circle(371,183,23,'#d3c081');
 return `<g>${art}</g>`;
}
