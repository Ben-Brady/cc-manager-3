import { ComponentProps, FC, memo, useMemo } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";
import { THREE } from "@/lib/three";

import { Tooltip } from "../WorldViewer";
import FlowerMesh, { isFlower } from "./FlowerMesh";
import FullBlockMesh from "./FullBlockMesh";
import LiquidMesh, { isLiquid } from "./LiquidMesh";
import MissingBlockMesh from "./MissingBoxMesh";
import { Vec3 } from "ccm-packet";

export type MeshProps = {
    blockName: string;
    positions: Vec3[];
    texture: Readonly<THREE.Texture> | undefined;
    meshProps: ComponentProps<"mesh">;
};

type BlockMeshProps = {
    texture: THREE.Texture | undefined;
    blockName: string;
    positions: Vec3[];
    setTooltip: (tooltip: Tooltip | undefined) => void;
};

const BlockMeshes: FC<BlockMeshProps> = memo(function BlockMesh({
    texture,
    blockName,
    positions,
    setTooltip,
}) {
    const meshprops: MeshProps = {
        blockName,
        texture,
        positions,
        meshProps: {
            onPointerEnter: (e: any) => {
                setTooltip({ text: blockName, x: e.layerX, y: e.layerY });
                e.stopPropagation();
            },
            onPointerOut: (e) => {
                setTooltip(undefined);
                e.stopPropagation();
            },
        },
    };

    if (isLiquid(blockName)) return <LiquidMesh {...meshprops} />;
    if (isFlower(blockName)) return <FlowerMesh {...meshprops} />;
    if (!texture) return <MissingBlockMesh {...meshprops} />;
    return <FullBlockMesh {...meshprops} />;
});

export default BlockMeshes;
