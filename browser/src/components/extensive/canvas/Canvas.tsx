import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useEffect, useState } from "react";
import * as THREE from "three";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/useComputerInfo";
import { ComputerInfo, TurtleInfo } from "@/lib/devices/types";
import { Vec3 } from "@/lib/packet";

import BlockBox from "./BlockBox";
import ComputerBox from "./ComputerBox";

const ComputerCanvas: FC<{ computers: ComputerInfo[]; blocks: Block[] }> = ({
    computers,
    blocks,
}) => {
    const turtle = computers.find((v) => v.type === "turtle");
    const camera = useTurtleCamera(turtle);

    if (!turtle || !camera) return null;

    return (
        <Container className="!p-0 w-full h-96">
            <Canvas
                camera={{
                    position: camera.position,
                    rotateY: camera.rotation,
                }}
            >
                {turtle?.position && (
                    <OrbitControls target={vectorToArray(turtle.position)} enablePan />
                )}
                <ambientLight />
                {blocks.map((v) => (
                    <BlockBox key={vectorToArray(v.position).toString() + v.name} block={v} />
                ))}
                {computers.map((v) => (
                    <ComputerBox key={v.id} computer={v} />
                ))}
            </Canvas>
        </Container>
    );
};

const useTurtleCamera = (
    turtle: TurtleInfo | undefined,
): undefined | { position: THREE.Vector3; rotation: number } => {
    if (!turtle) return undefined;

    const { facing, position } = turtle;
    if (!facing || !position) return undefined;

    const rotation =
        facing === "north" ? 0 : facing === "east" ? 0.25 : facing === "south" ? 0.5 : 0.75;
    const VERTICAL_OFFSET = 3;
    const HORIZONTAL_OFFSET = 3;

    let { x, y, z } = position;
    y += VERTICAL_OFFSET;

    if (facing === "west") x += HORIZONTAL_OFFSET;
    if (facing === "east") x -= HORIZONTAL_OFFSET;
    if (facing === "north") z += HORIZONTAL_OFFSET;
    if (facing === "south") z -= HORIZONTAL_OFFSET;
    return {
        position: new THREE.Vector3(x, y, z),
        rotation,
    };
};

export const vectorToArray = (vector: Vec3): [number, number, number] => [
    vector.x,
    vector.y,
    vector.z,
];

export default ComputerCanvas;
