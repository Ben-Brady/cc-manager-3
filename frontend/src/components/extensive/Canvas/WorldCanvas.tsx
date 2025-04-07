import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useMemo, useState } from "react";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/blocks/useBlocks";
import { ComputerInfo } from "@/lib/devices/types";

import BlockGroupMeshes, { BlockGroup } from "./Block/BlockGroupMeshes";
import FPSCounter from "./FPSCounter";
import { cullBlocks, occludeBlocks, VIEW_DISTANCE } from "./occlusion";
import PlayerMesh from "./PlayerMesh";
import TurtleCamera from "./TurtleCamera";
import TurtleMesh from "./TurtleMesh";

const WorldCanvas: FC<{
    computerId: number;
    computers: ComputerInfo[];
    blocks: Record<string, Block>;
}> = ({ computerId, computers, blocks }) => {
    const blockList = useMemo(() => {
        let blockList = cullBlocks(blocks, computers.find((v) => v.id === computerId)?.position);
        blockList = occludeBlocks(blockList, blocks);
        return blockList;
    }, [computerId, blocks]);
    const [targetId, setTargetId] = useState<number | undefined>();
    const blockGroups = useMemo(() => groupBlocks(blockList), [blockList]);

    return (
        <div className="w-full h-128">
            <Canvas>
                <AdaptiveDpr pixelated />
                <FPSCounter />
                <ambientLight />
                <fog attach="fog" args={["#c6c6c6", VIEW_DISTANCE - 2, VIEW_DISTANCE]} />
                <TurtleCamera targetId={targetId} />

                {blockGroups.map((group) => (
                    <BlockGroupMeshes key={group.name} group={group} />
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
        </div>
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
