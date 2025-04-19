import {
    requestEval,
    requestHeartbeat,
    requestScan,
    waitForPacket,
    type EvalOptions,
    type EvalResult,
    type WsConnection,
} from "ccm-connection";
import type { MemoryBank } from "ccm-memory";
import {
    ItemSlot,
    RequestBody,
    Direction,
    Vec3,
    type Computer,
    type HeartbeatResponse,
    type LockType,
    ScanResponse,
} from "ccm-packet";
import { getRotationOffset, rotateByOffset } from "./rotation";
import { calibrateTurtle } from "./calibrate";
import type { HandSlot } from "ccm-packet";

export type Turtle = {
    id: number;
    name: string;
    label: string | undefined;
    uptime: Computer["uptime"];
    lastUpdated: Computer["lastUpdated"];

    facing: Direction;
    position: Vec3;
    inventory: ItemSlot[];
    selectedSlot: number;
    leftHand: HandSlot | undefined;
    rightHand: HandSlot | undefined;

    restart: () => void;
    scan: (range: number) => Promise<void>;
    eval: (options: Omit<EvalOptions, "deviceId">) => Promise<EvalResult>;
    heartbeat: () => Promise<HeartbeatResponse>;

    selectSlot: (slot: number) => Promise<void>;

    goForward: () => Promise<boolean>;
    goBack: () => Promise<boolean>;
    goUp: () => Promise<boolean>;
    goDown: () => Promise<boolean>;

    turnLeft: () => Promise<boolean>;
    turnRight: () => Promise<boolean>;

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

    faceTowards: (direction: Direction) => Promise<void>;
};

export const wrapTurtle = async (
    conn: WsConnection,
    memory: MemoryBank,
    device: Computer,
): Promise<Turtle> => {
    if (device.type !== "turtle") throw new Error(`Tried to wrap device ${device.id} as turtle`);

    const name = device.label ? `Turtle ${device.label}(${device.id})` : `Turtle(${device.id})`;

    await calibrateTurtle(conn, device);

    if (!device.position) throw new Error(`${name} couldn't get position `);
    if (!device.selectedSlot) throw new Error(`${name} couldn't get selectedSlot`);
    if (!device.facing) throw new Error(`${name} couldn't get facing`);
    if (!device.inventory) throw new Error(`${name} couldn't get inventory`);
    if (!device.leftHand) throw new Error(`${name}: Couldn't get leftHand`);
    if (!device.rightHand) throw new Error(`${name}: Couldn't get rightHand`);

    const sendPacket = (packet: RequestBody) => {
        conn.sendPacket(device.id, packet);
    };

    const runCodeWithHeartbeat = async (code: string, locks: LockType[] = []) => {
        const result = await requestEval(conn, { deviceId: device.id, code, locks });
        await requestHeartbeat(conn, device.id);
    };

    let turtle: Turtle = {
        name,
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
        scan: async (range) => {
            await requestScan(conn, device.id, range);
        },
        eval: (options) => requestEval(conn, { deviceId: device.id, ...options }),
        heartbeat: () => requestHeartbeat(conn, device.id),

        goForward: () => performMovementAction(conn, device.id, "turtle.forward()"),
        goBack: () => performMovementAction(conn, device.id, "turtle.back()"),
        goUp: () => performMovementAction(conn, device.id, "turtle.up()"),
        goDown: () => performMovementAction(conn, device.id, "turtle.down()"),
        turnLeft: () => performMovementAction(conn, device.id, "turtle.turnLeft()"),
        turnRight: () => performMovementAction(conn, device.id, "turtle.turnRight()"),

        digFront: () => runCodeWithHeartbeat("turtle.dig()"),
        digUp: () => runCodeWithHeartbeat("turtle.digUp()"),
        digDown: () => runCodeWithHeartbeat("turtle.digDown()"),
        placeFront: () => runCodeWithHeartbeat("turtle.place()"),
        placeUp: () => runCodeWithHeartbeat("turtle.placeUp()"),
        placeDown: () => runCodeWithHeartbeat("turtle.placeDown()"),
        dropFront: () => runCodeWithHeartbeat("turtle.drop()"),
        dropUp: () => runCodeWithHeartbeat("turtle.dropUp()"),
        dropDown: () => runCodeWithHeartbeat("turtle.dropDown()"),
        suckFront: () => runCodeWithHeartbeat("turtle.suck()"),
        suckUp: () => runCodeWithHeartbeat("turtle.suckUp()"),
        suckDown: () => runCodeWithHeartbeat("turtle.suckDown()"),
        inspectFront: () => runCodeWithHeartbeat("turtle.inspect()"),
        inspectUp: () => runCodeWithHeartbeat("turtle.inspectUp()"),
        inspectDown: () => runCodeWithHeartbeat("turtle.inspectDown()"),

        async faceTowards(direction) {
            if (!turtle.facing) throw new Error("Turtle doesn't have rotation");
            const offset = getRotationOffset(this.facing, direction);
            await rotateByOffset(turtle, offset);
        },

        selectSlot: (slot: number) =>
            runCodeWithHeartbeat(`turtle.select(${slot + 1})`, ["inventory"]),
    };

    memory.onDeviceUpdate({
        callback: (device) => {
            if (turtle.id !== device.id) return;

            turtle.id = device.id;
            turtle.label = device.label;
            turtle.lastUpdated = device.lastUpdated;
            turtle.uptime = device.uptime;
            turtle.rightHand = device.rightHand;
            turtle.leftHand = device.leftHand;
            turtle.position = device.position ?? turtle.position;
            turtle.facing = device.facing ?? turtle.facing;
            turtle.selectedSlot = device.selectedSlot ?? turtle.selectedSlot;
            turtle.inventory = device.inventory ?? turtle.inventory;
        },
    });

    return turtle;
};

const performMovementAction = async (
    conn: WsConnection,
    deviceId: number,
    code: string,
): Promise<boolean> => {
    const result = await requestEval(conn, { deviceId, code, locks: ["movement"], timeout: 10_000 });
    if (result.isError) throw new Error(result.value);
    if (!result.value) return false;
    return JSON.parse(result.value) as boolean;
};
