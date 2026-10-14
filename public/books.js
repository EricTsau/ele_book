import { chapters } from './story.js';
import { fairytales } from './fairytales.js';
export const books=[{id:'three-little-pigs',title:'三隻小豬',english:'THE THREE LITTLE PIGS',subtitle:'三間小房子，一場大冒險。跟著小豬們，一起找到勇敢與耐心的力量。',age:'4 歲以上',theme:'forest',color:'#365044',cover:'pig',chapters,audioBase:'audio'},...fairytales.map(book=>({...book,audioBase:`audio/${book.id}`}))];
export const findBook=id=>books.find(book=>book.id===id);
