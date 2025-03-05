import { ComponentProps, FC, useCallback } from "react";

import { Block } from "@/hook/useBlocks";
import { LOADING, useBlockTexture } from "@/hook/useBlockTexture";
import { THREE } from "@/lib/three";

import { Tooltip } from "./ComputerCanvas";
import FlowerMesh, { isFlower } from "./FlowerMesh";
import FullBlockMesh from "./FullBlockMesh";
import MissingBlockMesh from "./MissingBoxMesh";
import DynamicBlockMesh from "./DynamicBlockMesh";

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
    console.log({ texture });
    const onPointerEnter = useCallback(
        (e: any) => {
            setTooltip({ text: block.name, x: e.layerX, y: e.layerY });
            e.stopPropagation();
        },
        [block.name, setTooltip],
    );
    const onPointerOut = useCallback(() => setTooltip(undefined), [block.name, setTooltip]);

    if (block.name === "minecraft:air") return null;
    if (block.name.startsWith("computercraft:turtle")) return null;
    if (texture === LOADING) return null;
    const meshprops: MeshProps = {
        block,
        isOverlappingTurtle,
        texture,
        meshProps: { onPointerEnter, onPointerOut },
    };

    if (isFlower(block.name)) return <FlowerMesh {...meshprops} />;
    return <DynamicBlockMesh {...meshprops} />;
};

export default BlockMesh;
