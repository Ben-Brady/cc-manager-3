import { FC, memo } from "react";

import { toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMesh";

const FullBlockMesh: FC<MeshProps> = memo(({ texture, block, meshProps }) => {
    const isTransparent = TRANSPARENT_BLOCKS.includes(block.name);

    return (
        <mesh position={toVec3Array(block.position)} {...meshProps}>
            <boxGeometry args={[1, 1, 1]} />
            {!isTransparent ? (
                <meshStandardMaterial map={texture} transparent={hasTransparency(block.name)} />
            ) : (
                <meshStandardMaterial map={texture} transparent opacity={0.6} />
            )}
        </mesh>
    );
});

const hasTransparency = (name: string) =>
    name.includes("glass") ||
    name.includes("leaves") ||
    name.includes("door") ||
    ["minecraft:bell"].includes(name);

const TRANSPARENT_BLOCKS = [
    "minecraft:stone",
    "minecraft:granite",
    "minecraft:andesite",
    "minecraft:tuff",
    "minecraft:dirt",
    "minecraft:deepslate",
];
export default FullBlockMesh;
