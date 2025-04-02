import { HeartbeatResponse, ResponsePacket } from "ccm-packet";
import type {
    DeviceType,
    ItemSlot,
    RotationUpdate,
    ScanResponse,
    PositionUpdate,
    BlockDetectionResponse,
    LockType,
    Rotation,
    Vec3,
} from "ccm-packet";
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
    console.trace(body);
    if (body.type === "update:block-detection") {
        applyBlockDetection(body);
    } else if (body.type === "response:scan") {
        applyScanResults(body);
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

const applyRotationUpdate = (body: RotationUpdate, sender: number) => {
    const device = deviceMap.get(sender);
    if (!device) return;
    device.facing = body.facing;
};

const applyPositionUpdate = (body: PositionUpdate, sender: number) => {
    const device = deviceMap.get(sender);
    if (!device) return;
    device.position = body.position;
};

const applyScanResults = (body: ScanResponse) => {
    const { range, position } = body;
    if (!position) return;

    for (let x = 1 - range; x < range; x++) {
        for (let y = 1 - range; y < body.range; y++) {
            for (let z = 1 - range; z < range; z++) {
                const blockPos = {
                    x: position.x + x,
                    y: position.y + y,
                    z: position.z + z,
                };

                const key = createPosKey(blockPos);
                blockMap.set(key, {
                    name: "minecraft:air",
                    lastDetected: Date.now(),
                    position: blockPos,
                });
            }
        }
    }

    for (const block of body.blocks) {
        const blockPos = {
            x: position.x + block.offset.x,
            y: position.y + block.offset.y,
            z: position.z + block.offset.z,
        };
        const key = createPosKey(blockPos);
        blockMap.set(key, {
            name: block.name,
            lastDetected: Date.now(),
            position: blockPos,
        });
    }

    const blocks = Array.from(blockMap.values());
    const json = JSON.stringify(blocks);
    writeFileSync(BLOCK_FILE, json);
};
