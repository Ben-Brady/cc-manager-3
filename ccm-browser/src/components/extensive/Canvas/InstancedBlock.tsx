import { ComponentProps, ComponentRef, FC, memo, useEffect, useRef } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";
import { THREE } from "@/lib/three";
import { MISSING_TEXTURE } from "@/lib/three/loader";

type InstancedMeshProps = {
    name: string;
    blocks: Block[];
    meshProps: ComponentProps<"mesh">;
};

const InstancedBlock: FC<InstancedMeshProps> = memo(({ name, blocks, meshProps }) => {
    const instancedMeshRef = useRef<ComponentRef<"instancedMesh">>(null);
    const texture = useBlockTexture(name);

    useEffect(() => {
        const mesh = instancedMeshRef.current;
        if (!mesh) return;
        if (texture === LOADING) return;

        let i = 0;
        for (const block of blocks) {
            const matrix = matrixFromPos(block.position);
            mesh.setMatrixAt(i++, matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingBox();
    }, [texture, blocks, name]);

    if (texture === LOADING) return null;
    if (name === "minecraft:air") return;

    return (
        <instancedMesh
            ref={instancedMeshRef}
            args={[null, null, Object.values(blocks).length]}
            {...meshProps}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={texture ?? MISSING_TEXTURE} transparent opacity={0.8} />
        </instancedMesh>
    );
});

const temp = new THREE.Object3D();
const matrixFromPos = ({ x, y, z }: { x: number; y: number; z: number }): THREE.Matrix4 => {
    temp.position.set(x, y, z);
    temp.updateMatrix();
    return temp.matrix;
};

export default InstancedBlock;
