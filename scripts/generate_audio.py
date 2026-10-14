"""Generate bundled zh-TW female dialogue; skip existing clips with matching metadata."""
import asyncio
import json
import subprocess
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
VOICE = 'zh-TW-HsiaoChenNeural'

async def main():
    books = json.loads(subprocess.check_output([
        'node', '--input-type=module', '-e',
        "import {books} from './public/books.js'; console.log(JSON.stringify(books));"
    ], cwd=ROOT, text=True))
    semaphore = asyncio.Semaphore(3)
    async def render(book, chapter, index, line, existing):
        output = ROOT / 'public' / book['audioBase']
        output.mkdir(exist_ok=True, parents=True)
        name = f'scene-{chapter}-line-{index}.mp3'
        record = {'file': name, 'speaker': line[0], 'text': line[1], 'voice': VOICE}
        if existing.get(name) == record and (output/name).exists() and (output/name).stat().st_size > 1000:
            return record
        temp = output / f'{name}.part'
        async with semaphore:
            for attempt in range(3):
                try:
                    await asyncio.wait_for(edge_tts.Communicate(line[1], VOICE, rate='+0%', pitch='+0Hz').save(str(temp)), timeout=45)
                    break
                except Exception as exc:
                    if attempt == 2: raise
                    print(f"retry {book['id']}/{name}: {type(exc).__name__}", flush=True)
                    await asyncio.sleep(2 ** (attempt + 1))
            temp.replace(output / name)
            existing[name] = record
            (output/'manifest.json').write_text(json.dumps({'voice':VOICE,'locale':'zh-TW','description':'Taiwanese Mandarin female synthetic voice','lines':list(existing.values())},ensure_ascii=False,indent=2)+'\n')
            print(f"{book['id']}/{name}", flush=True)
        return record
    async def render_book(book):
        output = ROOT / 'public' / book['audioBase']
        manifest = output / 'manifest.json'
        existing = {r['file']:r for r in json.loads(manifest.read_text())['lines']} if manifest.exists() else {}
        records = await asyncio.gather(*(render(book,i,j,line,existing) for i,c in enumerate(book['chapters']) for j,line in enumerate(c['lines'])))
        manifest.write_text(json.dumps({'voice':VOICE,'locale':'zh-TW','description':'Taiwanese Mandarin female synthetic voice','lines':records},ensure_ascii=False,indent=2)+'\n')
    await asyncio.gather(*(render_book(book) for book in books))

asyncio.run(main())
