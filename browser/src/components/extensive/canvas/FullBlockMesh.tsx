import { FC, memo } from "react";

import { MeshProps } from "./BlockMesh";
import { vec3ToThree } from "./ComputerCanvas";

const FullBlockMesh: FC<MeshProps> = memo(({ texture, block, meshProps }) => {
    const isWater = block.name === "minecraft:water" || block.name === "minecraft:lava";

    return (
        <mesh position={vec3ToThree(block.position)} {...meshProps}>
            <boxGeometry args={[1, 1, 1]} />
            {isWater ? (
                <meshStandardMaterial map={texture} transparent opacity={0.1} color="#0936ff" />
            ) : (
                <meshStandardMaterial map={texture} />
            )}
        </mesh>
    );
});

export default FullBlockMesh;
