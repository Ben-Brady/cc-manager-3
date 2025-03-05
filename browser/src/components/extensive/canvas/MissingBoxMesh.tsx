import { FC, memo } from "react";

import { MISSING_TEXTURE } from "@/lib/three/loader";

import { MeshProps } from "./BlockMesh";
import { vec3ToArray } from "./ComputerCanvas";

const MissingBlockMesh: FC<MeshProps> = memo(({ block, meshProps }) => (
    <mesh position={vec3ToArray(block.position)} {...meshProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={MISSING_TEXTURE} />
    </mesh>
));

export default MissingBlockMesh;
