import { Canvas } from "@react-three/fiber";
import { FC, Suspense, useMemo, useState } from "react";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/useBlocks";
import { ComputerInfo, TurtleInfo } from "@/lib/devices/types";
import { isEqualVec3, Vec3 } from "@/lib/packet/generic";
import { toStringVec3, toVec3Array } from "@/lib/three/utils";

import BlockMesh from "./Block/BlockMesh";
import TurtleMesh from "./TurtleMesh";
import TurtleCamera from "./TurtleCamera";
import { isBlockOccluding } from "@/lib/minecraft/occluding";
import { AdaptiveDpr } from "@react-three/drei";
import { calculateOccludedBlocks, VIEW_DISTANCE } from "./occlusion";
import MissingBlockMesh from "./Block/MissingBoxMesh";
import { MISSING_TEXTURE } from "@/lib/three/loader";
import PlayerMesh from "./PlayerMesh";

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
                <Canvas>
                    <AdaptiveDpr pixelated />
                    <ambientLight />
                    <fog attach="fog" args={["#c6c6c6", VIEW_DISTANCE * 0.8, VIEW_DISTANCE]} />
                    <TurtleCamera targetId={targetId} />
                    {blockList.map((block) => (
                        <BlockMesh
                            key={toStringVec3(block.position) + block.name}
                            block={block}
                            setTooltip={setTooltip}
                        />
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

export default WorldCanvas;
