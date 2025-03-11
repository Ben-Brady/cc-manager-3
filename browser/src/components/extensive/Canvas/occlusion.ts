import { Block } from "@/hook/useBlocks";
import { isBlockOccluding } from "@/lib/minecraft/occluding";
import { Vec3 } from "@/lib/packet";
import { toStringVec3 } from "@/lib/three/utils";

export const calculateOccludedBlocks = (
    blockTable: Record<string, Block>,
    position: Vec3 | undefined,
): Block[] => {
    const coverredCache = new Map<string, boolean>();
    const isCovered = (position: Vec3) => {
        const key = toStringVec3(position);
        const cached = coverredCache.get(key);
        if (cached !== undefined) return cached;

        const block = blockTable[key];
        const occluding = !block || isBlockOccluding(block.name);
        // const occluding = block && isBlockOccluding(block.name);
        coverredCache.set(key, occluding);
        return occluding;
    };

    const isBlockSurrounded = (position: Vec3) =>
        isCovered({ ...position, x: position.x + 1 }) &&
        isCovered({ ...position, x: position.x - 1 }) &&
        isCovered({ ...position, y: position.y + 1 }) &&
        isCovered({ ...position, y: position.y - 1 }) &&
        isCovered({ ...position, z: position.z + 1 }) &&
        isCovered({ ...position, z: position.z - 1 });

    const shouldCullBlock = (position: Vec3) => {
        const block = blockTable[toStringVec3(position)];
        if (block.name.includes("ore")) return false;

        return isBlockSurrounded(position);
    };

    let blocks = Array.from(Object.values(blockTable)) as Block[];

    blocks = blocks.filter((v) => v.name !== "minecraft:air");
    if (position) {
        blocks = blocks.filter((v) => distance(position, v.position) < VIEW_DISTANCE);
    }
    blocks = blocks.filter((v) => !shouldCullBlock(v.position));

    return blocks;
};

export const VIEW_DISTANCE = 16;

const distance = (a: Vec3, b: Vec3) => {
    const x = Math.abs(a.x - b.x);
    const y = Math.abs(a.y - b.y);
    const z = Math.abs(a.z - b.z);
    return Math.sqrt(x * x + y * y + z * z);
};
