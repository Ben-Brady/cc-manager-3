import { ComponentProps, FC, memo, useMemo } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";
import { THREE } from "@/lib/three";

import { Tooltip } from "../WorldCanvas";
import FlowerMesh, { isFlower } from "./FlowerMesh";
import FullBlockMesh from "./FullBlockMesh";
import LiquidMesh, { isLiquid } from "./LiquidMesh";
import MissingBlockMesh from "./MissingBoxMesh";

export type MeshProps = {
    block: Block;
    texture: Readonly<THREE.Texture> | undefined;
    meshProps: ComponentProps<"mesh">;
};

type BlockMeshProps = {
    texture: THREE.Texture | undefined;
    block: Block;
    setTooltip: (tooltip: Tooltip | undefined) => void;
};

const BlockMesh: FC<BlockMeshProps> = memo(function BlockMesh({ texture, block, setTooltip }) {
    const meshprops: MeshProps = {
        block,
        texture: texture!,
        meshProps: {
            onPointerEnter: (e: any) => {
                setTooltip({ text: block.name, x: e.layerX, y: e.layerY });
                e.stopPropagation();
            },
            onPointerOut: (e) => {
                setTooltip(undefined);
                e.stopPropagation();
            },
        },
    };

    if (isLiquid(block.name)) return <LiquidMesh {...meshprops} />;
    if (!texture) return <MissingBlockMesh {...meshprops} />;
    if (isFlower(block.name)) return <FlowerMesh {...meshprops} />;
    return <FullBlockMesh {...meshprops} />;
});

export default BlockMesh;
