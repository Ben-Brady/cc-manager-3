import { ComponentProps, FC, memo, useMemo } from "react";

import { Face, getModelFaces } from "@/lib/minecraft/model";

import { MeshProps } from "./BlockMesh";
import { toVector3 } from "@/lib/three/utils";
import { THREE } from "@/lib/three";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";

const DynamicBlockMesh: FC<MeshProps> = ({ block, meshProps }) => {
    const faces = useMemo(() => {
        return getModelFaces(block.name, {});
    }, []);
    console.log({ faces });

    if (!faces) return null;

    const pos = toVector3(block.position);
    return (
        <>
            {faces.map((v) => (
                <FaceMesh face={v} meshProps={meshProps} offset={pos} />
            ))}
        </>
    );
};

const FaceMesh: FC<{ face: Face; offset: THREE.Vector3; meshProps: ComponentProps<"mesh"> }> = ({
    face: { origin, rotation, side, size, texture },
    offset,
    meshProps,
}) => {
    let map = useBlockTexture(texture);
    if (map === LOADING) map = undefined;

    return (
        <mesh
            position={new THREE.Vector3(...offset.toArray()).add(origin).toArray()}
            rotation={rotation}
            {...meshProps}
        >
            <planeGeometry args={[size.x, size.y]} />

            <meshStandardMaterial map={map} side={side} color="#ffffff" />
        </mesh>
    );
};

export default DynamicBlockMesh;
