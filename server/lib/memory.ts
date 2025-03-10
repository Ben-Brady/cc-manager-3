import { HeartbeatResponse, ResponsePacket, type DeviceType, type ItemSlot } from "./packet";
import type { BlockDetectionResponse } from "./packet/actions/block";
import type { PositionResponse } from "./packet/actions/position";
import type { RotationResponse } from "./packet/actions/rotation";
import type { ScanResponse } from "./packet/actions/scan";
import type { LockType, Rotation, Vec3 } from "./packet/generic";
import { computerMessageListeners } from "./websocket";
import { writeFileSync, readFileSync, existsSync } from "fs";
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
    position?: Vec3;
};

type Block = {
    position: Vec3;
    name: string;
    lastDetected: number;
};

const deviceMap = new Map<number, ComputerInfo>();
const blockMap = new Map<string, Block>();

const BLOCK_FILE = "blocks.json";
const createPosKey = (pos: Vec3) => `${pos.x}-${pos.y}-${pos.z}`;

if (existsSync(BLOCK_FILE)) {
    const json = readFileSync(BLOCK_FILE).toString("utf-8");
    const blocks = JSON.parse(json) as Block[];
    blocks.map((block) => {
        const key = createPosKey(block.position);
        blockMap.set(key, block);
    });
}

export const getDevices = (): ComputerInfo[] => {
    return Array.from(deviceMap.values());
};

export const getBlocks = (): Block[] => {
    return Array.from(blockMap.values());
};

computerMessageListeners.set(":memory:", (data) => {
    const { body, sender } = ResponsePacket.parse(JSON.parse(data));

    console.log(`<-${sender} ${body.type}`);
    if (body.type === "update:block-detection") {
        applyBlockDetection(body);
    } else if (body.type === "response:scan") {
        applyScanResults(body, sender);
    } else if (body.type === "update:rotation") {
        applyRotationUpdate(body, sender);
    } else if (body.type === "update:position") {
        applyPositionUpdate(body, sender);
    } else if (body.type === "response:heartbeat") {
        applyHeartbeat(body, sender);
    }
});

const applyBlockDetection = (body: BlockDetectionResponse) => {
    const pos = body.position;

    const key = `${pos.x}-${pos.y}-${pos.z}`;
    blockMap.set(key, {
        position: pos,
        name: body.block,
        lastDetected: Date.now(),
    });
    const blocks = Array.from(blockMap.values());
    const json = JSON.stringify(blocks);
    writeFileSync(BLOCK_FILE, json);
};

const applyHeartbeat = (body: HeartbeatResponse, sender: number) => {
    const computer = deviceMap.get(sender);
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
    deviceMap.set(sender, device);
};

const applyRotationUpdate = (body: RotationResponse, sender: number) => {
    const device = deviceMap.get(sender);
    if (!device) return;
    device.facing = body.facing;
};

const applyPositionUpdate = (body: PositionResponse, sender: number) => {
    const device = deviceMap.get(sender);
    if (!device) return;
    device.position = body.position;
};

const applyScanResults = (body: ScanResponse) => {
    body.blocks.forEach(({ block, position }) => {
        const key = `${position.x}-${position.y}-${position.z}`;
        blockMap.set(key, {
            name: block,
            position,
            lastDetected: Date.now(),
        });
    });

    const blocks = Array.from(blockMap.values());
    const json = JSON.stringify(blocks);
    writeFileSync(BLOCK_FILE, json);
};
