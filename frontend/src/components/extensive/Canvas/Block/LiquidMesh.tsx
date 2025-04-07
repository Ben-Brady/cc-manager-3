import { FC, memo } from "react";

import { toStringVec3, toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMeshes";

export const isLiquid = (name: string) => name === "minecraft:water" || name === "minecraft:lava";

const LiquidMesh: FC<MeshProps> = ({ blockName, positions, meshProps }) => {
    const isWater = blockName === "minecraft:water";
    const isLava = blockName === "minecraft:lava";

    if (!isWater && !isLava) return null;

    return (
        <>
            {positions.map((pos) => (
                <mesh
                    key={toStringVec3(pos) + blockName}
                    position={toVec3Array(pos)}
                    {...meshProps}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial
                        transparent
                        opacity={0.2}
                        color={isWater ? "#0936ff" : "#ff3a09"}
                    />
                </mesh>
            ))}
        </>
    );
};

export default LiquidMesh;
