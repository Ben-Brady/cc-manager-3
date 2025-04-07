import { requestEval, requestHeartbeat, type WsConnection } from "ccm-connection";
import type { MemoryBank } from "ccm-memory";
import {
    ItemSlot,
    RequestBody,
    Rotation,
    Vec3,
    type Computer,
    type HeartbeatResponse,
    type LockType,
} from "ccm-packet";

export type Turtle = {
    id: number;
    label: string | undefined;
    uptime: Computer["uptime"];
    lastUpdated: Computer["lastUpdated"];

    facing: Computer["facing"];
    position: Computer["position"];
    inventory: Computer["inventory"];
    selectedSlot: Computer["selectedSlot"];
    leftHand: Computer["leftHand"];
    rightHand: Computer["rightHand"];

    restart: () => void;
    scan: (range: number) => void;
    eval: (locks: LockType[], code: string) => Promise<{ success: boolean; value: string }>;
    heartbeat: () => Promise<HeartbeatResponse>;

    select: (slot: number) => Promise<void>;

    goForward: () => Promise<void>;
    goBack: () => Promise<void>;
    goUp: () => Promise<void>;
    goDown: () => Promise<void>;

    turnLeft: () => Promise<void>;
    turnRight: () => Promise<void>;

    digFront: () => Promise<void>;
    digUp: () => Promise<void>;
    digDown: () => Promise<void>;

    placeFront: () => Promise<void>;
    placeUp: () => Promise<void>;
    placeDown: () => Promise<void>;

    dropFront: () => Promise<void>;
    dropUp: () => Promise<void>;
    dropDown: () => Promise<void>;

    suckFront: () => Promise<void>;
    suckUp: () => Promise<void>;
    suckDown: () => Promise<void>;

    inspectFront: () => Promise<void>;
    inspectUp: () => Promise<void>;
    inspectDown: () => Promise<void>;
};

export const wrapTurtle = (conn: WsConnection, memory: MemoryBank, deviceId: number): Turtle => {
    const device = memory.devices[deviceId];
    const sendPacket = (packet: RequestBody) => {
        const utc = Date.now() / 1000;
        console.log(`${utc} | ${deviceId}-> | ${packet.type}`);
        conn.sendPacket(deviceId, packet);
    };

    const runCode = async (locks: LockType[], heartbeat: boolean, code: string) => {
        const utc = Date.now() / 1000;
        console.log(`${utc} | ${deviceId}-> | request:eval`);
        console.time("requestEval");
        await requestEval(conn, deviceId, code, locks);
        console.timeEnd("requestEval");
        if (heartbeat) {
            const utc = Date.now() / 1000;
            console.log(`${utc} | ${deviceId}-> | request:heartbeat`);
            await requestHeartbeat(conn, deviceId);
        }
    };

    const turtle: Turtle = {
        id: device.id,
        label: device.label,
        lastUpdated: device.lastUpdated,
        uptime: device.uptime,
        position: device.position,
        facing: device.facing,
        selectedSlot: device.selectedSlot,
        inventory: device.inventory,
        rightHand: device.rightHand,
        leftHand: device.leftHand,

        restart: () => sendPacket({ type: "request:restart" }),
        scan: (range) => sendPacket({ type: "request:scan", range }),

        eval: async (locks, code) => {
            const data = await requestEval(conn, deviceId, code, locks);
            return { success: !data.isError, value: data.value };
        },
        heartbeat: async () => {
            const packet = await requestHeartbeat(conn, deviceId);
            return packet;
        },

        goForward: () => runCode(["movement"], false, "turtle.forward()"),
        goBack: () => runCode(["movement"], false, "turtle.back()"),
        goUp: () => runCode(["movement"], false, "turtle.up()"),
        goDown: () => runCode(["movement"], false, "turtle.down()"),
        turnLeft: () => runCode(["movement"], false, "turtle.turnLeft()"),
        turnRight: () => runCode(["movement"], false, "turtle.turnRight()"),

        digFront: () => runCode([], true, "turtle.dig()"),
        digUp: () => runCode([], true, "turtle.digUp()"),
        digDown: () => runCode([], true, "turtle.digDown()"),
        placeFront: () => runCode([], true, "turtle.place()"),
        placeUp: () => runCode([], true, "turtle.placeUp()"),
        placeDown: () => runCode([], true, "turtle.placeDown()"),
        dropFront: () => runCode([], true, "turtle.drop()"),
        dropUp: () => runCode([], true, "turtle.dropUp()"),
        dropDown: () => runCode([], true, "turtle.dropDown()"),
        suckFront: () => runCode([], true, "turtle.suck()"),
        suckUp: () => runCode([], true, "turtle.suckUp()"),
        suckDown: () => runCode([], true, "turtle.suckDown()"),
        inspectFront: () => runCode([], true, "turtle.inspect()"),
        inspectUp: () => runCode([], true, "turtle.inspectUp()"),
        inspectDown: () => runCode([], true, "turtle.inspectDown()"),

        select: (slot: number) => runCode(["inventory"], true, `turtle.select(${slot + 1})`),
    };

    memory.onDeviceUpdate({
        callback: (device) => {
            if (turtle.id !== device.id) return;

            turtle.id = device.id;
            turtle.label = device.label;
            turtle.lastUpdated = device.lastUpdated;
            turtle.uptime = device.uptime;
            turtle.position = device.position;
            turtle.facing = device.facing;
            turtle.selectedSlot = device.selectedSlot;
            turtle.inventory = device.inventory;
            turtle.rightHand = device.rightHand;
            turtle.leftHand = device.leftHand;
        },
    });

    return turtle;
};
