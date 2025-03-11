import { FC, memo } from "react";

import { MISSING_TEXTURE } from "@/lib/three/loader";
import { toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMesh";

const MissingBlockMesh: FC<MeshProps> = memo(({ block, meshProps }) => (
    <mesh position={toVec3Array(block.position)} {...meshProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={MISSING_TEXTURE} transparent opacity={0.8} />
    </mesh>
));

export default MissingBlockMesh;
