import { createMemoryBank } from "ccm-memory";
import { broadcastHeartbeatRequest, connectToProxy, requestHeartbeat } from "ccm-connection";
import { wrapTurtle, type Turtle } from "./turtle";
import { sleep } from "bun";
import { log } from "./log";
import { LockType, Vec3 } from "ccm-packet";
import type { WsConnection } from "ccm-connection";

const conn = await connectToProxy("ws://localhost:8000");

const memory = createMemoryBank();
conn.onPacket(({ body, sender }) => {
    log(`<-${sender} | ${body.type}`);
});
conn.onPacket((packet) => {
    memory.feedPacket(packet);
});

// Load all devices
await broadcastHeartbeatRequest(conn);
await sleep(1000);

const turtle = wrapTurtle(conn, memory, 0);
if (!turtle.position) throw new Error("Turtle doesn't have position");

const requestEval = async (
    conn: WsConnection,
    deviceId: number,
    settings: {
        code: string;
        locks?: LockType[];
    },
) => {
    const { code, locks = [] } = settings;

    conn.sendPacket(deviceId, { type: "request:eval", code, locks });
    await new Promise((resolve) => {
        const controller = new AbortController();
        conn.onPacket((packet) => {
            if (packet.sender !== deviceId) return;
            if (packet.body.type !== "response:eval") return;
            resolve(null);
            controller.abort();
        }, controller.signal);
    });
};

const mineOre = (turtle: Turtle, position: Vec3) => {};
while (true) {
    await turtle.turnLeft();
    await turtle.turnRight();
    await turtle.goUp();
    await turtle.goDown();
}
