# 故事來源與內容製作

本次新增 20 本：10 本公有領域經典改寫、10 本為小葉故事屋新創作的故事。所有新增故事均有六章、完整敘事與新寫的繁體中文對白。封面 SVG、Three.js 角色與道具由專案自行建立，不使用現代出版繪本的插圖、角色造型或錄音。

## 經典改寫的來源

選用古代寓言與 19 世紀作品的原作情節；沒有複製現代中文譯本，也沒有把原作來源網站的文字或插圖打包到網站。來源用於確認作品身分與公有領域依據。

| 本站書名 | 原作／作者 | 來源版本 |
| --- | --- | --- |
| 北風與太陽 | The North Wind and the Sun／伊索寓言 | [Project Gutenberg 11339](https://www.gutenberg.org/ebooks/11339) |
| 烏鴉喝水 | The Crow and the Pitcher／伊索寓言 | [Project Gutenberg 11339](https://www.gutenberg.org/ebooks/11339) |
| 狐狸與葡萄 | The Fox and the Grapes／伊索寓言 | [Project Gutenberg 11339](https://www.gutenberg.org/ebooks/11339) |
| 鄉下老鼠與城市老鼠 | The Town Mouse and the Country Mouse／伊索寓言 | [Project Gutenberg 11339](https://www.gutenberg.org/ebooks/11339) |
| 螞蟻與鴿子 | The Ant and the Dove／伊索寓言 | [Project Gutenberg 11339](https://www.gutenberg.org/ebooks/11339) |
| 不來梅的樂隊 | The Bremen Town Musicians（版本中題為 The Travelling Musicians）／格林兄弟 | [Project Gutenberg 2591](https://www.gutenberg.org/ebooks/2591) |
| 甜粥 | Sweet Porridge／格林兄弟 | [Project Gutenberg 52521](https://www.gutenberg.org/ebooks/52521) |
| 星星銀幣 | The Star-Money／格林兄弟 | [Project Gutenberg 52521](https://www.gutenberg.org/ebooks/52521) |
| 皇帝的新衣 | The Emperor’s New Clothes／安徒生 | [Project Gutenberg 1597](https://www.gutenberg.org/ebooks/1597) |
| 豌豆公主 | The Princess and the Pea（版本中題為 The Real Princess）／安徒生 | [Project Gutenberg 1597](https://www.gutenberg.org/ebooks/1597) |

Project Gutenberg 將上述版本標示為美國公有領域。伊索是古代作家；格林兄弟分別於 1863、1859 年逝世，安徒生於 1875 年逝世。台灣一般自然人著作財產權期間為作者生存期間及死後五十年，參見[智慧財產局第 30 條說明](https://www.tipo.gov.tw/tw/copyright/692-68944.html)。本次選書採用這些早期原作，而非仍受保護的新改編版本。

原作公有領域與現代譯本是不同層次；翻譯等衍生著作可獨立受保護，參見[智慧財產局說明](https://www.tipo.gov.tw/tw/copyright/692-14169.html)。因此本專案重新撰寫文字與對白，保留原作者標示。這份來源表不是對所有司法管轄區、所有後續用途的零風險保證。

為適合親子閱讀，部分情節經過溫和處理；例如《皇帝的新衣》以貼身衣物呈現，《星星銀幣》保留女孩的基本衣物，《豌豆公主》在結尾邀請讀者思考故事中的身分考驗。這些是本站改寫，並非原文翻譯。

## 本次原創故事

以下文字、人物設定與情節為本專案透過 AI 輔助新創作，非指定既有作品的改寫，也不模仿特定在世作者的文風。

1. 有好多窗的燈籠：朋友合力修補燈籠，也重新思考照亮行路的用途。
2. 雨滴郵局的空白信：替不會寫字的長輩找到表達思念與正確寄信的方法。
3. 先聽一聽的小橋：建橋之前先聆聽不同使用者的需要。
4. 影子今天去哪裡：在陪伴之中，也給朋友自主活動的空間。
5. 種子圖書館的借書卡：把沒有發芽的經驗記下來，幫助下一個種植者。
6. 留一格空白的鐘：學習安排休息，而非把每一刻都塞滿。
7. 紙船畫的河流地圖：從紙船的流向認識水流，並把船帶回岸上。
8. 雲裁縫的口袋：練習適量承擔，把雲的雨水送到需要的地方。
9. 星光下的晚安麵包店：為不同作息的鄰居調整麵包店的營業安排。
10. 聽得見小聲音的樂團：重新安排節奏，讓小聲音也能被聽見。

「原創」描述本次內容的製作方式，不代表已取得獨占權或完成全球作品相似性檢索。

## 配音與程式授權

背景音樂與劇情音效由 `public/soundscape.js` 使用 Web Audio 振盪器與程序化雜訊即時合成，未下載或取樣外部音樂、音效庫。

故事文字來源與配音服務是不同項目。所有對白以 `zh-TW-HsiaoChenNeural` 合成，未取用現有有聲書錄音。配音仍受相關語音服務條款影響；不能因原作屬公有領域，就把第三方服務或程式庫全部視為沒有授權限制。程式碼 MIT License 與 Three.js、GSAP 等第三方條款見 [README](README.md#license)。
