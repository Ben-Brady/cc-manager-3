import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useMemo, useState } from "react";

import { ComputerInfo } from "@/lib/devices/types";

import BlockGroupMeshes, { BlockGroup } from "./Block/BlockGroupMeshes";
import { VIEW_DISTANCE } from "./occlusion";
import PlayerMesh from "./PlayerMesh";
import TurtleCamera from "./TurtleCamera";
import TurtleMesh from "./TurtleMesh";
import FPSCounter from "./FPSCounter";

export type Tooltip = {
    x: number;
    y: number;
    text: string;
};

const WorldCanvas: FC<{
    computerId: number;
    computers: ComputerInfo[];
    blockGroups: BlockGroup[];
    setTooltip: (tooltip: Tooltip | undefined) => void;
}> = ({ computerId, computers, blockGroups, setTooltip }) => {
    const [targetId, setTargetId] = useState<number | undefined>();

    const pocketComputers = computers.filter((v) => v.type === "pocket");
    const turtles = computers.filter((v) => v.type === "turtle");

    return (
        <Canvas dpr={1}>
            <AdaptiveDpr pixelated />
            <FPSCounter />
            <ambientLight />
            <fog attach="fog" args={["#c6c6c6", VIEW_DISTANCE - 2, VIEW_DISTANCE]} />
            <TurtleCamera targetId={targetId} />

            {blockGroups.map((group) => (
                <BlockGroupMeshes key={group.name} group={group} setTooltip={setTooltip} />
            ))}
            {pocketComputers.map((v) => {
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
            {turtles.map((v) => (
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
    );
};

export default WorldCanvas;
