import { FC, memo } from "react";

import { toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMesh";

export const isLiquid = (name: string) => name === "minecraft:water" || name === "minecraft:lava";

const LiquidMesh: FC<MeshProps> = memo(({ block, meshProps }) => {
    const isWater = block.name === "minecraft:water";
    const isLava = block.name === "minecraft:lava";

    if (!isWater && !isLava) return null;

    return (
        <mesh position={toVec3Array(block.position)} {...meshProps}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                transparent
                opacity={0.2}
                color={isWater ? "#0936ff" : "#ff3a09"}
            />
        </mesh>
    );
});

export default LiquidMesh;
