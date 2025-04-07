import { createMemoryBank } from "ccm-memory";
import { broadcastHeartbeatRequest, connectToProxy, requestHeartbeat } from "ccm-connection";
import { wrapTurtle } from "./turtle";
import { sleep } from "bun";

const conn = await connectToProxy("ws://localhost:8000");

const memory = createMemoryBank();
conn.onPacket(({ body, sender }) => {
    const utc = Date.now() / 1000;
    console.log(`${utc} | <-${sender} | ${body.type}`);
});
conn.onPacket((packet) => {
    memory.feedPacket(packet);
});

// Load all devices
await broadcastHeartbeatRequest(conn);
await sleep(1000);

const turtle = wrapTurtle(conn, memory, 0);
if (!turtle.position) throw new Error("Turtle doesn't have position");

while (true) {
    await turtle.goUp();
    await turtle.goDown();
}
