import { ComponentProps, FC, memo, useMemo } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";
import { THREE } from "@/lib/three";

import { Tooltip } from "../ComputerCanvas";
import FlowerMesh, { isFlower } from "./FlowerMesh";
import FullBlockMesh from "./FullBlockMesh";
import LiquidMesh, { isLiquid } from "./LiquidMesh";
import MissingBlockMesh from "./MissingBoxMesh";
import { isEqualVec3 } from "@/lib/packet/generic";

export type MeshProps = {
    block: Block;
    texture: Readonly<THREE.Texture> | undefined;
    isOverlappingTurtle: boolean;
    meshProps: ComponentProps<"mesh">;
};

type BlockMeshProps = {
    block: Block;
    isOverlappingTurtle: boolean;
    setTooltip: (tooltip: Tooltip | undefined) => void;
};

const BlockMesh: FC<BlockMeshProps> = ({ block, isOverlappingTurtle, setTooltip }) => {
    const texture = useBlockTexture(block.name);
    const meshprops: MeshProps = useMemo(
        () => ({
            block,
            isOverlappingTurtle,
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
        }),
        [block, isOverlappingTurtle, texture, setTooltip],
    );

    if (block.name === "minecraft:air") return null;
    if (block.name.startsWith("computercraft:turtle")) return null;
    if (texture === LOADING) return null;

    if (isLiquid(block.name)) return <LiquidMesh {...meshprops} />;
    if (!texture) return <MissingBlockMesh {...meshprops} />;
    if (isFlower(block.name)) return <FlowerMesh {...meshprops} />;
    return <FullBlockMesh {...meshprops} />;
};

export default BlockMesh;
