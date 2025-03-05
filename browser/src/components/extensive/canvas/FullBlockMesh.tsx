import { FC, memo } from "react";

import { MeshProps } from "./BlockMesh";
import { vec3ToArray } from "./ComputerCanvas";

const FullBlockMesh: FC<MeshProps> = memo(({ texture, block, meshProps }) => {
    return (
        <mesh position={vec3ToArray(block.position)} {...meshProps}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={texture} transparent />
        </mesh>
    );
});

export default FullBlockMesh;
