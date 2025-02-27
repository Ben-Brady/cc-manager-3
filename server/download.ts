import { sleep } from "bun";
import { mkdirSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import jsdom from "jsdom";

mkdirSync("./output", { recursive: true });

const downloadPage = async (pid: number): Promise<any[]> => {
    const param = `tags=id:>=${pid * 1000}+id:<${(pid + 1) * 1000}`;
    const url = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1000&" + param;

    const r = await fetch(url);
    const text = await r.text();

    const dom = new jsdom.JSDOM(text, { contentType: "application/xml" });
    const doc = dom.window.document;
    const postNodes = Array.from(doc.querySelectorAll("post"));

    const posts = postNodes.map((v) =>
        Object.fromEntries(Array.from(v.attributes).map(({ name, value }) => [name, value])),
    );
    return posts;
};

const TOTAL = 10_000;
const BATCH_SIZE = 10;

for (let x = 0; x < Math.floor(TOTAL / BATCH_SIZE); x++) {
    let batch = [];
    for (let y = 0; y < BATCH_SIZE; y++) {
        const pid = x * BATCH_SIZE + y;
        const posts = await downloadPage(pid);
        batch.push(...posts);

        const progress = (1 / TOTAL) * pid;
        console.log(`${progress * 100}%`);
    }

    const startPid = x * BATCH_SIZE;
    const endPid = x * BATCH_SIZE + 9;
    const data = JSON.stringify(batch);
    const gziped = gzipSync(data);
    writeFileSync(`./output/${startPid}-${endPid}.json.gz`, gziped);
}
