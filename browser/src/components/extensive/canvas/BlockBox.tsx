import { FC, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

import { Block } from "@/hook/useBlocks";

import { vectorToArray } from "./Canvas";

const BlockBox: FC<{
    block: Block;
    texture: string | null | undefined;
    requestTexture: (name: string) => void;
    onCreateTooltip: (x: number, y: number) => void;
    onCloseTooltip: () => void;
}> = ({ block, texture, requestTexture, onCreateTooltip, onCloseTooltip }) => {
    if (block.name === "minecraft:air") return null;

    useEffect(() => {
        if (texture === undefined) requestTexture(block.name);
    }, [texture]);

    const base = useMemo(
        () => (texture ? new THREE.TextureLoader().load(texture) : undefined),
        [texture],
    );

    if (texture === undefined) return null;

    return (
        <mesh
            key={vectorToArray(block.position).toString() + block.name}
            position={vectorToArray(block.position)}
            scale={1}
            onPointerMove={(e) => {
                onCreateTooltip(e.layerX, e.layerY);
                e.stopPropagation();
            }}
            onPointerOut={(e) => {
                onCloseTooltip();
                e.stopPropagation();
            }}
        >
            <boxGeometry args={[1, 1, 1]} />
            {block.name === "minecraft:water" ? (
                <meshStandardMaterial transparent opacity={0.1} color="#0936ff" />
            ) : (
                <meshStandardMaterial map={base} />
            )}
        </mesh>
    );
};

export default BlockBox;
