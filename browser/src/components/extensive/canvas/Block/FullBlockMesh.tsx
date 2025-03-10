import { FC, memo } from "react";

import { toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMesh";
import { isEqualVec3 } from "@/lib/packet/generic";

const FullBlockMesh: FC<MeshProps> = memo(({ texture, block, meshProps }) => {
    const isTransparent = TRANSPARENT_BLOCKS.includes(block.name);

    return (
        <mesh position={toVec3Array(block.position)} {...meshProps}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={texture} transparent opacity={0.1} />
            {/* {!isTransparent ? (
                <meshStandardMaterial map={texture} />
            ) : (
                <meshStandardMaterial map={texture} transparent opacity={0.8} />
            )} */}
        </mesh>
    );
});

const TRANSPARENT_BLOCKS = ["minecraft:stone", "minecraft:dirt", "minecraft:deepslate"];
export default FullBlockMesh;
