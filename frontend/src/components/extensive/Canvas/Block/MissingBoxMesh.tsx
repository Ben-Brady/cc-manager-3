import { FC, memo } from "react";

import { MISSING_TEXTURE } from "@/lib/three/loader";
import { toStringVec3, toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMeshes";

const MissingBlockMesh: FC<MeshProps> = ({ blockName, positions, meshProps }) => (
    <>
        {positions.map((pos) => (
            <mesh key={toStringVec3(pos) + blockName} position={toVec3Array(pos)} {...meshProps}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial map={MISSING_TEXTURE} transparent opacity={0.8} />
            </mesh>
        ))}
    </>
);

export default MissingBlockMesh;
