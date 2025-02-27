import { ResponsePacket, type DeviceType, type ItemSlot, type Vector } from "./packet";
import type { LockType, Rotation } from "./packet/generic";
import { computerMessageListeners } from "./websocket";

export type ComputerInfo = {
    id: number;
    type: DeviceType;
    uptime: number;
    lastUpdated: number;

    locks: LockType[];
    inventory?: ItemSlot[];
    selectedSlot?: number;
    facing?: Rotation;
    leftHand?: ItemSlot;
    rightHand?: ItemSlot;
    label?: string;
    position?: Vector;
};

type Block = {
    position: Vector;
    name: string;
};
const devices = new Map<number, ComputerInfo>();
const blocks = new Map<string, Block>();

computerMessageListeners.set("memory", (data) => {
    const { body, sender } = ResponsePacket.parse(JSON.parse(data));

    if (body.type === "response:rotation") {
        const device = devices.get(sender);
        if (!device) return;
        device.facing = body.facing;
    }

    if (body.type === "response:block-detection") {
        const position = devices.get(sender)?.position;
        const rotation = devices.get(sender)?.facing;
        if (!position || !rotation) return;
        let blockPos = (() => {
            if (body.direction === "up") return { ...position, y: position.y + 1 };
            if (body.direction === "down") return { ...position, y: position.y - 1 };
            if (body.direction === "front") {
                if (rotation === "east") return { ...position, x: position.x + 1 };
                if (rotation === "west") return { ...position, x: position.x - 1 };
                if (rotation === "north") return { ...position, z: position.z - 1 };
                if (rotation === "south") return { ...position, z: position.z + 1 };
            }
            throw new Error("?");
        })();

        const key = `${blockPos.x}-${blockPos.y}-${blockPos.z}`;
        blocks.set(key, {
            position: blockPos,
            name: body.block,
        });
    }

    if (body.type === "response:heartbeat") {
        const computer = devices.get(sender);
        const selectedSlot =
            body.deviceData.type === "turtle" ? body.deviceData.selectedSlot : undefined;

        const device = {
            ...computer,
            ...body,
            id: sender,
            label: body.label,
            lastUpdated: Date.now(),
            uptime: Math.floor(body.uptime),
            type: body.deviceData.type,
            position: body.position ?? computer?.position,
            selectedSlot: selectedSlot ?? computer?.selectedSlot,
            locks: body.locks ?? computer?.locks,
        } satisfies ComputerInfo;
        devices.set(sender, device);
    }
});

export const getDevices = (): ComputerInfo[] => {
    return Object.values(devices);
};

export const getBlocks = (): Block[] => {
    return Object.values(blocks);
};
