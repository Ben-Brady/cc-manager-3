import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

import Container from "@/components/elements/Container";
import { Block, vec3Key } from "@/hook/useBlocks";
import { ComputerInfo, TurtleInfo } from "@/lib/devices/types";
import { getBlockTexture } from "@/lib/minecraft/texture";
import { Vec3 } from "@/lib/packet";
import { vec3Compare } from "@/lib/packet/generic";

import BlockMesh from "./BlockMesh";
import TurtleMesh from "./ComputerBox";
import { isFlower } from "./FlowerMesh";

export type Tooltip = {
    x: number;
    y: number;
    text: string;
};

const ComputerCanvas: FC<{
    turtle: TurtleInfo;
    computers: ComputerInfo[];
    blocks: Record<string, Block>;
}> = ({ turtle, computers, blocks }) => {
    const camera = calcCamera(turtle, Object.values(blocks));
    const [tooltip, setTooltip] = useState<Tooltip | undefined>(undefined);
    const blockList = useMemo(() => {
        let blockList = Array.from(Object.values(blocks)) as Block[];
        return blockList;
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
            <Canvas>
                <CameraControls blocks={blockList} turtle={turtle} />
                <ambientLight />
                {blockList.map((block) => (
                    <BlockMesh
                        key={vec3Key(block.position).toString() + block.name}
                        block={block}
                        isOverlappingTurtle={vec3Compare(block.position, turtle?.position)}
                        setTooltip={setTooltip}
                    />
                ))}
                {computers
                    .filter((v) => v.type === "turtle")
                    .map((turtle) => (
                        <TurtleMesh key={turtle.id} turtle={turtle} />
                    ))}
            </Canvas>
        </Container>
    );
};

const isBlockSurrounded = (position: Vec3, blocks: Record<string, Block>) => {
    const isFullBlock = ({ x = 0, y = 0, z = 0 }: { x?: number; y?: number; z?: number }) => {
        const blockPos = { x: position.x + x, y: position.y + y, z: position.z + z };
        const key = vec3Key(blockPos);
        const block = blocks[key];
        if (block === undefined) return false;
        if (isFlower(block.name)) return false;
        return true;
    };

    return (
        isFullBlock({ x: 1 }) &&
        isFullBlock({ x: -1 }) &&
        isFullBlock({ y: 1 }) &&
        isFullBlock({ y: -1 }) &&
        isFullBlock({ z: 1 }) &&
        isFullBlock({ z: -1 })
    );
};

const CameraControls: FC<{ blocks: Block[]; turtle: TurtleInfo | undefined }> = ({ turtle }) => {
    return (
        <OrbitControls
            maxDistance={5}
            target={!turtle?.position ? undefined : vec3ToThree(turtle.position)}
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

export const vec3ToThree = ({ x, y, z }: Vec3): THREE.Vector3 => new THREE.Vector3(x, y, z);

export default ComputerCanvas;
