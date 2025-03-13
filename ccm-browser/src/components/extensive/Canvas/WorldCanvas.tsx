import { Canvas } from "@react-three/fiber";
import { FC, useMemo, useState } from "react";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/useBlocks";
import { ComputerInfo } from "@/lib/devices/types";

import TurtleMesh from "./TurtleMesh";
import TurtleCamera from "./TurtleCamera";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { calculateOccludedBlocks, VIEW_DISTANCE } from "./occlusion";
import PlayerMesh from "./PlayerMesh";
import BlockGroupMeshes from "./Block/BlockGroupMeshes";

export type Tooltip = {
    x: number;
    y: number;
    text: string;
};

const WorldCanvas: FC<{
    computerId: number;
    computers: ComputerInfo[];
    blocks: Record<string, Block>;
}> = ({ computerId, computers, blocks }) => {
    const [tooltip, setTooltip] = useState<Tooltip | undefined>();
    const [targetId, setTargetId] = useState<number | undefined>();
    const blockList = useMemo(
        () => calculateOccludedBlocks(blocks, computers.find((v) => v.id === computerId)?.position),
        [computerId, blocks],
    );
    const blockGroups = useMemo(() => groupBlocks(blockList), [blockList]);

    return (
        <>
            <div className="flex flex-col">
                <span>Total Blocks={Object.values(blocks).length} </span>
                <span>
                    Total Blocks (No Air)=
                    {Object.values(blocks).filter((v) => v.name !== "minecraft:air").length}{" "}
                </span>
                <span>Rendered Blocks={blockList.length}</span>
            </div>
            <Container className="!p-0 w-full h-96 relative">
                {tooltip && (
                    <Container
                        className="absolute z-10 font-minecraft"
                        style={{ left: tooltip.x, top: tooltip.y }}
                    >
                        {tooltip.text}
                    </Container>
                )}
                <Canvas dpr={1}>
                    <AdaptiveDpr pixelated />
                    <ambientLight />
                    <fog attach="fog" args={["#c6c6c6", VIEW_DISTANCE - 2, VIEW_DISTANCE]} />
                    <PerformanceMonitor onChange={(api) => console.log(`${api.fps}FPS`)} />
                    <TurtleCamera targetId={targetId} />

                    {blockGroups.map((group) => (
                        <BlockGroupMeshes key={group.name} group={group} setTooltip={setTooltip} />
                    ))}
                    {computers
                        .filter((v) => v.type === "pocket")
                        .map((v) => {
                            if (!v.position) return null;
                            return (
                                <PlayerMesh
                                    key={v.id}
                                    position={v.position}
                                    onGetId={(id) => {
                                        const isPrimary = v.id === computerId;
                                        if (isPrimary) setTargetId(id);
                                    }}
                                />
                            );
                        })}
                    {computers
                        .filter((v) => v.type === "turtle")
                        .map((v) => (
                            <TurtleMesh
                                key={v.id}
                                turtle={v}
                                onGetId={(id) => {
                                    const isPrimary = v.id === computerId;
                                    if (isPrimary) setTargetId(id);
                                }}
                            />
                        ))}
                </Canvas>
            </Container>
        </>
    );
};

const groupBlocks = (blocks: Block[]): BlockGroup[] => {
    const groups: Record<string, BlockGroup> = {};

    for (const block of blocks) {
        if (!(block.name in groups)) {
            groups[block.name] = { name: block.name, blocks: [] };
        }

        groups[block.name].blocks.push(block);
    }

    return Object.values(groups);
};

export default WorldCanvas;
