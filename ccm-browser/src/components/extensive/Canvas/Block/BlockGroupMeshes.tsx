import { FC } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";
import { toStringVec3 } from "@/lib/three/utils";

import { Tooltip } from "../WorldCanvas";
import BlockMesh from "./BlockMesh";

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

    return (
        <>
            {blocks.map((block) => (
                <BlockMesh
                    key={toStringVec3(block.position) + block.name}
                    texture={texture}
                    block={block}
                    setTooltip={setTooltip}
                />
            ))}
        </>
    );
};

export default BlockGroupMeshes;
