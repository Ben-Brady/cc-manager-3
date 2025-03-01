import { FC, useEffect, useState } from "react";
import * as THREE from "three";

import { Block } from "@/hook/useComputerInfo";
import { getBlockTexture } from "@/lib/item";

import { vectorToArray } from "./Canvas";

const BlockBox: FC<{ block: Block }> = ({ block }) => {
    const texture = useBlockTexture(block.name);

    if (block.name === "minecraft:air") return null;
    if (!texture) return null;

    const base = new THREE.TextureLoader().load(texture);

    return (
        <mesh position={vectorToArray(block.position)} scale={1} >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" map={base} />
        </mesh>
    );
};

const useBlockTexture = (name: string): string | undefined => {
    const [texture, setTexture] = useState<string | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const texture = await getBlockTexture(name);
            setTexture(texture ?? undefined);
        })();
    }, []);

    return texture;
};
export default BlockBox;
