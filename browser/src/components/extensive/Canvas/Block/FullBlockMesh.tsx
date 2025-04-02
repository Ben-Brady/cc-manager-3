import { FC, memo } from "react";

import { toStringVec3, toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMeshes";
import { Instance, Instances } from "@react-three/drei";

const FullBlockMesh: FC<MeshProps> = ({ texture, positions, blockName, meshProps }) => {
    const isTransparent = TRANSPARENT_BLOCKS.includes(blockName);

    return (
        <Instances>
            <boxGeometry args={[1, 1, 1]} />
            {!isTransparent ? (
                <meshStandardMaterial map={texture} transparent={hasTransparency(blockName)} />
            ) : (
                <meshStandardMaterial map={texture} transparent opacity={0.6} />
            )}

            {positions.map((pos) => (
                <Instance
                    key={toStringVec3(pos) + blockName}
                    position={toVec3Array(pos)}
                    {...meshProps}
                />
            ))}
        </Instances>
    );
};

export const hasTransparency = (name: string) =>
    name.includes("glass") ||
    name.includes("leaves") ||
    name.includes("door") ||
    ["minecraft:bell", "minecraft:seagrass"].includes(name);

const TRANSPARENT_BLOCKS = [
    "minecraft:stone",
    "minecraft:granite",
    "minecraft:andesite",
    "minecraft:tuff",
    "minecraft:deepslate",
];
export default FullBlockMesh;
