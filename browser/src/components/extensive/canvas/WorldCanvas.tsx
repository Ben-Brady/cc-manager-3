import { Canvas } from "@react-three/fiber";
import { FC, useMemo, useState } from "react";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/useBlocks";
import { ComputerInfo, TurtleInfo } from "@/lib/devices/types";
import { isEqualVec3, Vec3 } from "@/lib/packet/generic";
import { toStringVec3 } from "@/lib/three/utils";

import BlockMesh from "./Block/BlockMesh";
import TurtleMesh from "./ComputerMesh";
import TurtleCamera from "./TurtleCamera";
import { isBlockOccluding } from "@/lib/minecraft/occluding";

export type Tooltip = {
    x: number;
    y: number;
    text: string;
};

const WorldCanvas: FC<{
    turtle: TurtleInfo;
    computers: ComputerInfo[];
    blocks: Record<string, Block>;
}> = ({ turtle, computers, blocks }) => {
    const [tooltip, setTooltip] = useState<Tooltip | undefined>();
    const [turtleMeshId, setTurtleMeshId] = useState<number | undefined>();
    const blockList = useMemo(
        () => calculateRenderedBlocks(blocks, turtle.position),
        [turtle.position, blocks],
    );

    return (
        <>
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
                    <TurtleCamera targetId={turtleMeshId} />
                    <fog args={["#000000", 10, 200]} />
                    <ambientLight />
                    {blockList.map((block) => (
                        <BlockMesh
                            key={toStringVec3(block.position) + block.name}
                            block={block}
                            isOverlappingTurtle={isEqualVec3(block.position, turtle?.position)}
                            setTooltip={setTooltip}
                        />
                    ))}
                    {computers
                        .filter((v) => v.type === "turtle")
                        .map((v) => (
                            <TurtleMesh
                                key={v.id}
                                turtle={v}
                                onGetId={(id) => {
                                    console.log(id);
                                    const isPrimary = v.id === turtle.id;
                                    if (isPrimary) setTurtleMeshId(id);
                                }}
                            />
                        ))}
                </Canvas>
            </Container>
            <div className="flex flex-col">
                <span>Total Blocks={Object.values(blocks).length} </span>
                <span>
                    Total Blocks (No Air)=
                    {Object.values(blocks).filter((v) => v.name !== "minecraft:air").length}{" "}
                </span>
                <span>Rendered Blocks={blockList.length}</span>
            </div>
        </>
    );
};

const calculateRenderedBlocks = (blockTable: Record<string, Block>, position: Vec3 | undefined) => {
    const KEY = `calculateRenderedBlocks(${Object.values(blockTable).length} blocks)`;
    console.time(KEY);

    const coverredCache = new Map<string, boolean>();
    const isCovered = (position: Vec3) => {
        const key = toStringVec3(position);
        const cached = coverredCache.get(key);
        if (cached !== undefined) return cached;

        const block = blockTable[key];
        const occluding = !block || isBlockOccluding(block.name);
        coverredCache.set(key, occluding);
        return occluding;
    };

    const shouldCullBlock = (position: Vec3) => {
        return (
            isCovered({ ...position, x: position.x + 1 }) &&
            isCovered({ ...position, x: position.x - 1 }) &&
            isCovered({ ...position, y: position.y + 1 }) &&
            isCovered({ ...position, y: position.y - 1 }) &&
            isCovered({ ...position, z: position.z + 1 }) &&
            isCovered({ ...position, z: position.z - 1 })
        );
    };

    let blocks = Array.from(Object.values(blockTable)) as Block[];

    blocks = blocks
        .filter((v) => v.name !== "minecraft:air")
        .filter((v) => !shouldCullBlock(v.position));

    // const VIEW_DISTANCE = 20;
    const TOTAL_RENDERED = 2500;
    if (position) {
        blocks = blocks
            .map((v) => ({ value: v, dist: distance(position!, v.position) }))
            .sort((a, b) => a.dist - b.dist)
            .map((v) => v.value)
            .slice(0, TOTAL_RENDERED);
    }
    console.log(blocks);
    console.timeEnd(KEY);
    return blocks;
};

const distance = (a: Vec3, b: Vec3) => {
    const x = Math.abs(a.x - b.x);
    const y = Math.abs(a.y - b.y);
    const z = Math.abs(a.z - b.z);
    return Math.sqrt(x * x + y * y + z * z);
};

export default WorldCanvas;
