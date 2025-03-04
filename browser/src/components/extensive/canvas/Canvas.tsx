import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useEffect, useState } from "react";
import * as THREE from "three";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/useBlocks";
import { ComputerInfo, TurtleInfo } from "@/lib/devices/types";
import { Vec3 } from "@/lib/packet";
import { vec3Compare } from "@/lib/packet/generic";
import { getBlockTexture } from "@/lib/texture";

import BlockMesh from "./BlockBox";
import TurtleMesh from "./ComputerBox";

type Tooltip = {
    x: number;
    y: number;
    text: string;
};

const ComputerCanvas: FC<{ turtle: TurtleInfo; computers: ComputerInfo[]; blocks: Block[] }> = ({
    turtle,
    computers,
    blocks,
}) => {
    const camera = calcCamera(turtle, blocks);
    const [tooltip, setTooltip] = useState<Tooltip | undefined>(undefined);
    const [textures, setTextures] = useState<Record<string, string | null>>({});

    useEffect(() => {
        blocks.forEach(({ name }) => {
            (async () => {
                const texture = await getBlockTexture(name);
                setTextures((textures) => ({
                    ...textures,
                    [name]: texture,
                }));
            })();
        });
    }, [blocks]);

    return (
        <Container className="!p-0 w-full h-96 relative">
            {tooltip && (
                <Container
                    className="absolute z-10 font-minecraft"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.text}
                </Container>
            )}
            <Canvas camera={camera}>
                <CameraControls blocks={blocks} turtle={turtle} />
                <ambientLight />
                {blocks.map((block) => (
                    <BlockMesh
                        key={vectorToArray(block.position).toString() + block.name}
                        block={block}
                        isOverlappingTurtle={vec3Compare(block.position, turtle?.position)}
                        texture={textures[block.name]}
                        onCreateTooltip={(x, y) => setTooltip({ text: block.name, x, y })}
                        onCloseTooltip={() => setTooltip(undefined)}
                    />
                ))}
                {computers
                    .filter((v) => v.type === "turtle")
                    .map((v) => (
                        <TurtleMesh key={v.id} turtle={v} />
                    ))}
            </Canvas>
        </Container>
    );
};

const CameraControls: FC<{ blocks: Block[]; turtle: TurtleInfo | undefined }> = ({ turtle }) => {
    return (
        <OrbitControls
            maxDistance={5}
            target={!turtle?.position ? undefined : vectorToArray(turtle.position)}
            enablePan
        />
    );
};

const calcCamera = (
    turtle: TurtleInfo | undefined,
    blocks: Block[],
): { position: THREE.Vector3; rotation: THREE.Euler } => {
    const position = turtle?.position;
    const facing = turtle?.facing;

    if (!facing || !position) {
        let x = 0;
        let y = 0;
        let z = 0;

        for (const block of blocks) {
            x += block.position.x;
            y += block.position.y;
            z += block.position.z;
        }

        return { position: new THREE.Vector3(x, y, z), rotation: new THREE.Euler() };
    }

    const rotation = new THREE.Euler();
    const quaterTurn = -(Math.PI / 2);
    if (facing === "north") rotation.y = 0.25;
    if (facing === "east") rotation.y = 0.5;
    if (facing === "south") rotation.y = 0.75;
    if (facing === "west") rotation.y = 1;

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
        rotation: rotation,
    };
};

export const vectorToArray = (vector: Vec3): [number, number, number] => [
    vector.x,
    vector.y,
    vector.z,
];

export default ComputerCanvas;
