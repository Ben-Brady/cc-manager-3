import "three/addons/geometries/TextGeometry.js";

import { FC, memo } from "react";

import { Vec3 } from "ccm-packet";
import { toVec3Array } from "@/lib/three/utils";

type PlayerMeshProps = {
    position: Vec3;
    onGetId: (value: number) => void;
};

const PlayerMesh: FC<PlayerMeshProps> = memo(function PlayerMesh({ position, onGetId }) {
    return (
        <mesh
            position={toVec3Array({
                x: position.x - 0.5,
                z: position.z - 0.5,
                y: position.y - 1,
            })}
            onUpdate={(state) => onGetId(state.id)}
        >
            <capsuleGeometry args={[0.5, 1, 1]} />
            <meshStandardMaterial color="#ffffff" />
        </mesh>
    );
});

export default PlayerMesh;
