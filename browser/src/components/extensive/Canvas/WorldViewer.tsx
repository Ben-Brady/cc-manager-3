import { Canvas } from "@react-three/fiber";
import { FC, useMemo, useState } from "react";

import Container from "@/components/elements/Container";
import { Block } from "@/hook/useBlocks";
import { ComputerInfo } from "@/lib/devices/types";

import { cullBlocks, occludeBlocks } from "./occlusion";
import WorldCanvas from "./WorldCanvas";

export type Tooltip = {
    x: number;
    y: number;
    text: string;
};

const WorldViewer: FC<{
    computerId: number;
    computers: ComputerInfo[];
    blocks: Record<string, Block>;
}> = ({ computerId, computers, blocks }) => {
    const [tooltip, setTooltip] = useState<Tooltip | undefined>();
    const [targetId, setTargetId] = useState<number | undefined>();
    const blockList = useMemo(() => {
        let blockList = cullBlocks(blocks, computers.find((v) => v.id === computerId)?.position);
        blockList = occludeBlocks(blockList, blocks);
        return blockList;
    }, [computerId, blocks]);
    const blockGroups = useMemo(() => groupBlocks(blockList), [blockList]);

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
                <WorldCanvas
                    blockGroups={blockGroups}
                    computerId={computerId}
                    computers={computers}
                    setTooltip={() => {}}
                />
            </Container>
            <div className="flex gap-2 w-full">
                <Container className="grid grid-cols-[auto_auto] place-items-end gap-x-2">
                    <span>Total Blocks</span>
                    <span className="w-full">{Object.values(blocks).length} </span>
                    <span>Total Blocks (No Air)</span>
                    <span className="w-full">
                        {Object.values(blocks).filter((v) => v.name !== "minecraft:air").length}
                    </span>
                    <span>Rendered Blocks</span>
                    <span className="w-full">{blockList.length}</span>
                </Container>
            </div>
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

export default WorldViewer;
