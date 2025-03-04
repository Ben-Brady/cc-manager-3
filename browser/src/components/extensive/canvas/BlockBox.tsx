import { FC, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { Block } from "@/hook/useBlocks";
import { loadTexture } from "@/lib/three/loader";

import { vectorToArray } from "./Canvas";

const BlockMesh: FC<{
    block: Block;
    isOverlappingTurtle: boolean;
    texture: string | null | undefined;
    onCreateTooltip: (x: number, y: number) => void;
    onCloseTooltip: () => void;
}> = ({ block, texture, isOverlappingTurtle, onCreateTooltip, onCloseTooltip }) => {
    const intervalRef = useRef<any | undefined>(undefined);

    useEffect(() => {
        return () => intervalRef.current && clearInterval(intervalRef.current);
    }, []);

    const base = useMemo(() => loadTexture(texture ?? "/missing.png"), [texture]);

    // Is Loading
    if (block.name === "minecraft:air") return null;
    if (texture === undefined) return null;

    return (
        <mesh
            key={vectorToArray(block.position).toString() + block.name}
            position={vectorToArray(block.position)}
            scale={1}
            onPointerEnter={(e) => {
                intervalRef.current = setTimeout(() => {
                    onCreateTooltip(e.layerX, e.layerY);
                }, 300);
                e.stopPropagation();
            }}
            onPointerOut={(e) => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                onCloseTooltip();
                e.stopPropagation();
            }}
        >
            <boxGeometry args={[1, 1, 1]} />
            {block.name === "minecraft:water" ? (
                <meshStandardMaterial transparent opacity={0.1} color="#0936ff" />
            ) : (
                <meshStandardMaterial
                    map={base}
                    transparent
                    opacity={isOverlappingTurtle ? 0.2 : 0.7}
                />
            )}
        </mesh>
    );
};

export default BlockMesh;
