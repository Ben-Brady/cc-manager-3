import { FC } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";

import { Tooltip } from "../WorldViewer";
import BlockMeshes from "./BlockMeshes";

export type BlockGroup = {
    name: string;
    blocks: Block[];
};

const BlockGroupMeshes: FC<{
    group: BlockGroup;
    setTooltip: (tooltip: Tooltip | undefined) => void;
}> = ({ group, setTooltip }) => {
    const { name, blocks } = group;
    const texture = useBlockTexture(name);

    if (name === "minecraft:air") return null;
    if (name.startsWith("computercraft:turtle")) return null;
    if (texture === LOADING) return null;

    const block = blocks[0];

    return (
        <BlockMeshes
            blockName={block.name}
            texture={texture}
            positions={blocks.map((v) => v.position)}
            setTooltip={setTooltip}
        />
    );
};

export default BlockGroupMeshes;
