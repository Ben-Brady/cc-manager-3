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
import TurtleMesh from "./ComputerMesh";
import { isFlower } from "./FlowerMesh";
import { isBlockOccluding } from "@/lib/minecraft/occluding";

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
    const [tooltip, setTooltip] = useState<Tooltip | undefined>(undefined);
    const blockList = useMemo(() => {
        return Array.from(Object.values(blocks)) as Block[];
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
        if (!block) return false;
        return isBlockOccluding(block.name);
    };

    const top = isFullBlock({ y: 1 });
    const bottom = isFullBlock({ y: -1 });
    const east = isFullBlock({ x: 1 });
    const west = isFullBlock({ x: -1 });
    const south = isFullBlock({ z: 1 });
    const north = isFullBlock({ z: -1 });
    const cull = top && bottom && east && west && south && north;
    return cull;
};

const CameraControls: FC<{ blocks: Block[]; turtle: TurtleInfo | undefined }> = ({ turtle }) => {
    return (
        <OrbitControls
            maxDistance={10}
            target={!turtle?.position ? undefined : vec3ToArray(turtle.position)}
            enablePan
        />
    );
};

export const vec3ToArray = ({ x, y, z }: Vec3): [number, number, number] => [x, y, z];

export default ComputerCanvas;
