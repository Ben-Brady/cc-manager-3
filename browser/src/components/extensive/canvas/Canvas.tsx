import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useEffect, useState } from "react";
import * as THREE from "three";

import { Vec3 } from "@/lib/packet";
import { ComputerInfo } from "@/lib/types";
import Container from "@/components/elements/Container";

const ComputerBox: FC<{ computer: ComputerInfo }> = ({ computer }) => {
    const { position } = computer;
    if (!position) return null;

    const color = (() => {
        if (computer.type === "computer") return "#37ffa1";
        if (computer.type === "turtle") return "#ff9837";
        if (computer.type === "pocket") return "#ff37e4";
    })();

    return (
        <mesh position={vectorToArray(position)} scale={1}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const ComputerCanvas: FC<{ computers: ComputerInfo[] }> = ({ computers }) => {
    const turtle = computers.find((v) => v.type === "turtle");
    const [initialPosition, setInitialPosition] = useState<THREE.Vector3 | undefined>();

    useEffect(() => {
        setInitialPosition((pos) => {
            if (pos) return pos;
            if (turtle?.position) {
                const pos = vectorToArray(turtle.position);
                pos[1] += 10;
                return new THREE.Vector3(...pos);
            }
        });
    }, [computers]);

    return (
        <Container className="!p-0 w-full h-96">
            <Canvas
                camera={{
                    position: !initialPosition
                        ? undefined
                        : new THREE.Vector3(
                              initialPosition.x,
                              initialPosition.y + 10,
                              initialPosition.z,
                          ),
                }}
            >
                <OrbitControls target={initialPosition} enablePan />
                <ambientLight />
                {computers.map((v) => {
                    return <ComputerBox key={v.id} computer={v} />;
                })}
            </Canvas>
        </Container>
    );
};

const vectorToArray = (vector: Vec3): [number, number, number] => [vector.x, vector.y, vector.z];
export default ComputerCanvas;
