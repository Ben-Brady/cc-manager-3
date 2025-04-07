import { ResponsePacket } from "ccm-packet";
import { createMemoryBank } from "ccm-memory";
import { Block } from "ccm-packet";
import { computerMessageListeners } from "./websocket";
import { writeFileSync, readFileSync, existsSync, renameSync } from "fs";

const memory = createMemoryBank();

const BLOCK_FILE = "blocks.json";
if (existsSync(BLOCK_FILE)) {
    const json = readFileSync(BLOCK_FILE).toString("utf-8");
    const data = JSON.parse(json) as Block[];
    try {
        const schema = Block.array();
        const blocks = schema.parse(data);
        memory.feedBlocks(blocks);
    } catch {
        console.log("Failed to load blocks from blocks.json, renaming");
        renameSync(BLOCK_FILE, BLOCK_FILE + ".corrupted");
    }
}

memory.onBlockUpdates({
    callback: () => {
        const blocks = Array.from(Object.values(memory.blocks));
        const json = JSON.stringify(blocks);
        writeFileSync(BLOCK_FILE, json);
    },
});

export const getDevices = () => Object.values(memory.devices);
export const getBlocks = () => Object.values(memory.blocks);

computerMessageListeners.set(":memory:", (data) => {
    const packet = ResponsePacket.parse(JSON.parse(data));
    memory.feedPacket(packet);
});
