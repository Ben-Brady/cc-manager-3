import { FC, memo } from "react";

import { THREE } from "@/lib/three";
import { toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMesh";

const FLOWER_NAMES = [
    "minecraft:short_grass",
    "minecraft:dandelion",
    "minecraft:azure_bluet",
    "minecraft:oxeye_daisy",
    "minecraft:wheat",
    "minecraft:carrots",
    "minecraft:poppy",
    "minecraft:pumpkin_stem",
    "minecraft:cornflower",
    "minecraft:sugar_cane",
    "minecraft:melon_stem",
    "minecraft:tall_grass",

    "minecraft:torch",
    "minecraft:wall_torch",
    "minecraft:lever",
];
export const isFlower = (name: string) => FLOWER_NAMES.includes(name);

const FlowerMesh: FC<MeshProps> = memo(({ texture, block, meshProps }) => (
    <>
        <mesh position={toVec3Array(block.position)} rotation={[0, Math.PI / 4, 0]} {...meshProps}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh
            position={toVec3Array(block.position)}
            rotation={[0, (Math.PI / 4) * 3, 0]}
            {...meshProps}
        >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
    </>
));

export default FlowerMesh;
