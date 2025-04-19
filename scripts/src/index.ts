import { createMemoryBank } from "ccm-memory";
import { HeartbeatResponse } from "ccm-packet";
import {
    broadcastHeartbeatRequest,
    connectToProxy,
    fetchBlocks,
    fetchComputers,
} from "ccm-connection";
import { wrapTurtle as initialiseTurtle, type Turtle } from "./utils/turtle";
import { sleep } from "bun";
import { openSync, writeSync } from "fs";

const conn = await connectToProxy("ws://localhost:8000");

const memory = createMemoryBank();

memory.feedDevices(await fetchComputers("http://localhost:8000"));
memory.feedBlocks(await fetchBlocks("http://localhost:8000"));
conn.onPacket((packet) => memory.feedPacket(packet));

conn.onPacket((packet) => {
    const sender = packet.sender.toString().padStart(2);

    if (packet.body.type !== "response:heartbeat") {
        const f = openSync("./network.txt", "a");
        const timestamp = new Date().toISOString();
        writeSync(f, `${timestamp} | ${JSON.stringify(packet)}\n`);
    }

    if (packet.body.type === "response:eval") {
        console.log(`  ${sender} <- ${packet.body.type}:${packet.body.id}`);
    } else {
        console.log(`  ${sender} <- ${packet.body.type}`);
    }
});
conn.onPacketSent((packet) => {
    const f = openSync("./network.txt", "a");
    const timestamp = new Date().toISOString();
    writeSync(f, `${timestamp} | ${JSON.stringify(packet)}\n`);

    const dest = packet.destination.toString().padStart(2);
    if (packet.body.type === "request:eval") {
        console.log(`  ${dest} -> ${packet.body.type}:${packet.body.id}`);
    } else {
        console.log(`  ${dest} -> ${packet.body.type}`);
    }
});

// Load all devices
await broadcastHeartbeatRequest(conn);
await sleep(1000);

const findTurtle = (label: string) => {
    const device = Object.values(memory.devices).find((v) => v.label === label);
    if (!device) throw new Error(`Could not turtle: ${label}`);
    return device;
};

// const ben = await initialiseTurtle(conn, memory, findTurtle("Ben"));
const holly = await initialiseTurtle(conn, memory, findTurtle("Holly"));
const freya = await initialiseTurtle(conn, memory, findTurtle("Freya"));

await holly.faceTowards("-x");
await freya.faceTowards("-x");
while (true) {
    await Promise.all([holly.turnLeft(), freya.turnLeft()]);
}
