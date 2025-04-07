import { useFrame } from "@react-three/fiber";
import { FC } from "react";

import { useUpdatingRef } from "@/hook/useUpdatingRef";

const TurtleCamera: FC<{ targetId: number | undefined }> = ({ targetId }) => {
    const targetIdRef = useUpdatingRef(targetId);

    useFrame((state) => {
        const targetId = targetIdRef.current;
        if (!targetId) return;
        const turtleMesh = state.scene.getObjectById(targetId);
        if (!turtleMesh) return;

        const X_OFFSET = 5;
        const Y_OFFSET = 3;
        let { x, y, z } = turtleMesh.position;
        state.camera.position.setY(y + Y_OFFSET);

        state.camera.rotation.set(
            turtleMesh.rotation.x,
            turtleMesh.rotation.y,
            turtleMesh.rotation.z,
            turtleMesh.rotation.order,
        );

        state.camera.position.setX(
            turtleMesh.position.x + Math.sin(turtleMesh.rotation.y - Math.PI / 2) * X_OFFSET,
        );
        state.camera.position.setZ(
            turtleMesh.position.z + Math.cos(turtleMesh.rotation.y - Math.PI / 2) * X_OFFSET,
        );
        // x += X_OFFSET;
        // z += X_OFFSET;
        state.camera.lookAt(turtleMesh.position);
    });

    return null;
};

export default TurtleCamera;
