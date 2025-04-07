import { HeartbeatResponse, ScanResponse } from "ccm-packet";
import { ResponsePacket, Block, Computer, toStringVec3 } from "ccm-packet";

export type DeviceUpdateCallback = (device: Computer) => void;
export type BlockUpdatesCallback = (blocks: Block[]) => void;
export type MemoryBank = {
    feedPacket: (packet: ResponsePacket) => void;
    feedBlocks: (blocks: Block[]) => void;
    feedDevices: (devices: Computer[]) => void;

    blocks: Record<string, Block>;
    devices: Record<number, Computer>;
    onBlockUpdates: (options: { callback: BlockUpdatesCallback; signal?: AbortSignal }) => void;
    onDeviceUpdate: (options: { callback: DeviceUpdateCallback; signal?: AbortSignal }) => void;
};

export const createMemoryBank = (): MemoryBank => {
    let blockUpdateCallbacks: BlockUpdatesCallback[] = [];
    const onBlockUpdates: MemoryBank["onBlockUpdates"] = ({ callback, signal }) => {
        if (signal) {
            signal.onabort = () => {
                blockUpdateCallbacks = blockUpdateCallbacks.filter((v) => v !== callback);
            };
        }
    };
    const broadcastBlockUpdates = (blocks: Block[]) => {
        Promise.allSettled([...blockUpdateCallbacks.map(async (callback) => callback(blocks))]);
    };

    let deviceUpdateCallbacks: DeviceUpdateCallback[] = [];
    const onDeviceUpdate: MemoryBank["onDeviceUpdate"] = ({ callback, signal }) => {
        if (signal) {
            signal.onabort = () => {
                deviceUpdateCallbacks = deviceUpdateCallbacks.filter((v) => v !== callback);
            };
        }
    };
    const broadcastDeviceUpdate = async (device: Computer) => {
        console.log(deviceUpdateCallbacks);
        Promise.allSettled([...deviceUpdateCallbacks.map(async (callback) => callback(device))]);
    };

    let devices: Record<number, Computer> = {};
    let blocks: Record<string, Block> = {};

    const feedPacket: MemoryBank["feedPacket"] = ({ body, sender: deviceId }) => {
        if (body.type === "update:block-detection") {
            feedBlocks([{ name: body.block, position: body.position }]);
            return;
        }

        if (body.type === "response:scan") {
            const newBlocks = generateBlocksFromScan(body);
            if (newBlocks) {
                updateBlocks(newBlocks);
                broadcastBlockUpdates(newBlocks);
            }
            return;
        }

        if (body.type === "response:heartbeat") {
            if (!(deviceId in devices)) {
                devices[deviceId] = generateInitialDevice(body, deviceId);
            }

            const device = devices[deviceId];
            applyHeartbeat(device, body);
            broadcastDeviceUpdate(device);
            return;
        }

        if (body.type === "update:position") {
            if (deviceId in devices) {
                const device = devices[deviceId];
                device.lastUpdated = Date.now();
                device.position = body.position;
                broadcastDeviceUpdate(device);
            }
            return;
        }

        if (body.type === "update:rotation") {
            if (deviceId in devices) {
                const device = devices[deviceId];
                device.lastUpdated = Date.now();
                device.facing = body.facing;
                broadcastDeviceUpdate(device);
            }
            return;
        }

        if (body.type === "response:eval") {
            if (deviceId in devices) {
                const device = devices[deviceId];
                device.lastUpdated = Date.now();
                broadcastDeviceUpdate(device);
            }
            return;
        }
    };

    const updateBlocks = (newBlocks: Block[]) => {
        for (const block of newBlocks) {
            const key = toStringVec3(block.position);
            if (key in blocks) {
                // Mutate existing
                Object.assign(blocks[key], block);
            } else {
                blocks[key] = block;
            }
        }
    };

    const feedDevices: MemoryBank["feedDevices"] = (newDevices) => {
        for (const device of newDevices) {
            if (device.id in devices) {
                // Mutate existing
                Object.assign(devices[device.id], device);
            } else {
                devices[device.id] = device;
            }
        }
        newDevices.forEach((device) => broadcastDeviceUpdate(device));
    };

    const feedBlocks: MemoryBank["feedBlocks"] = (newBlocks) => {
        updateBlocks(newBlocks);
        broadcastBlockUpdates(newBlocks);
    };

    return {
        feedPacket,
        onBlockUpdates,
        onDeviceUpdate,
        feedDevices,
        feedBlocks,
        blocks,
        devices,
    };
};

const generateBlocksFromScan = (body: ScanResponse): Block[] | undefined => {
    const { position, range } = body;
    if (!position) return undefined;
    const newBlocks: Record<string, Block> = {};

    for (const block of body.blocks) {
        const blockPos = {
            x: position.x + block.offset.x,
            y: position.y + block.offset.y,
            z: position.z + block.offset.z,
        };
        const key = toStringVec3(blockPos);
        newBlocks[key] = {
            name: block.name,
            position: blockPos,
        };
    }

    const airBlocks: Record<string, Block> = {};
    for (let x = 1 - range; x < range; x++) {
        for (let y = 1 - range; y < body.range; y++) {
            for (let z = 1 - range; z < range; z++) {
                const blockPos = {
                    x: position.x + x,
                    y: position.y + y,
                    z: position.z + z,
                };
                const key = toStringVec3(blockPos);

                airBlocks[key] = {
                    name: "minecraft:air",
                    position: blockPos,
                };
            }
        }
    }
    const blocks = Object.values({ ...airBlocks, ...newBlocks });
    return blocks;
};

const generateInitialDevice = (heartbeat: HeartbeatResponse, devideId: number): Computer => {
    return {
        id: devideId,
        lastUpdated: Date.now(),
        uptime: Math.floor(heartbeat.uptime),
        type: heartbeat.deviceData.type,
        locks: [],
    };
};

const applyHeartbeat = (computer: Computer, body: HeartbeatResponse) => {
    const { deviceData } = body;
    if (deviceData.type !== "turtle") {
        Object.assign(computer, {
            type: computer.type,
            label: body.label,
            uptime: Math.floor(body.uptime),
            lastUpdated: Date.now(),
            position: body.position ?? computer.position,
            locks: body.locks,
        });
        return;
    }

    const inventory = Array.from({ length: 16 }).map((_, i) => deviceData?.inventory?.[i]);

    Object.assign(computer, {
        label: body.label,
        lastUpdated: Date.now(),
        uptime: Math.floor(body.uptime),
        type: deviceData.type,
        selectedSlot: deviceData.selectedSlot,
        locks: body.locks,
        fuel: deviceData.fuel,
        inventory: inventory,
        position: body.position ?? computer.position,
    });
};
