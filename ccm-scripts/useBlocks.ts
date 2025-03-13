import { Vec3 } from "./vec3";

type Block = {
    position: Vec3;
    name: string;
    lastDetected: number;
};

const createASDASD = async (): Promise<{ blocks: Map<string, Block> }> => {
    const r = await fetch("http://localhost:8000/api/blocks");
    const data = await r.json();
    const blockList = data as Block[];
    const blockMap = new Map<string, Block>(blockList.map((v) => [toStringVec3(v.position), v]));

    const websocket = new WebSocket("ws://localhost:8000/ws/client");

    const onBlockDetection = (body) => {
        const key = Vec3.from(body.position);
        const block: Block = {
            name: body.name,
            position: body.position,
            lastDetected: Date.now(),
        };
        blockMap.set(key.toString(), block);
    };

    const onScanResponse = (body) => {
        const { range, position } = body;
        const newBlocks: Record<string, Block> = {};

        for (const block of body.blocks) {
            const blockPos = new Vec3(
                position.x + block.offset.x,
                position.y + block.offset.y,
                position.z + block.offset.z,
            );
            newBlocks[blockPos.toString()] = {
                name: block.name,
                lastDetected: Date.now(),
                position: blockPos,
            };
        }

        const airBlocks: Record<string, Block> = {};
        for (let x = 1 - range; x < range; x++) {
            for (let y = 1 - range; y < body.range; y++) {
                for (let z = 1 - range; z < range; z++) {
                    const blockPos = new Vec3(position.x + x, position.y + y, position.z + z);
                    airBlocks[blockPos.toString()] = {
                        name: "minecraft:air",
                        lastDetected: Date.now(),
                        position: blockPos,
                    };
                }
            }
        }
        const scanBlocks = { ...airBlocks, ...newBlocks };
        Object.entries(scanBlocks).map(([key, block]) => blockMap.set(key, block));
    };

    websocket.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        const { sender, body } = ResponsePacket.parse(data);

        if (body.type === "update:block-detection") {
            onBlockDetection(body);
        } else if (body.type === "response:scan") {
            onScanResponse(body);
        }
    };

    return { blocks: blockMap };
};
