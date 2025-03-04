import { FC, memo } from "react";

import { THREE } from "@/lib/three";

import { MeshProps } from "./BlockMesh";
import { vec3ToThree } from "./ComputerCanvas";

const FLOWER_NAMES = [
    "minecraft:short_grass",
    "minecraft:dandelion",
    "minecraft:azure_bluet",
    "minecraft:oxeye_daisy",
    "minecraft:torch",
    "minecraft:poppy",
    "minecraft:pumpkin_stem",
    "minecraft:cornflower",
    "minecraft:wall_torch",
];
export const isFlower = (name: string) => FLOWER_NAMES.includes(name);

const FlowerMesh: FC<MeshProps> = memo(({ texture, block, meshProps }) => (
    <>
        <mesh position={vec3ToThree(block.position)} rotation={[0, Math.PI / 4, 0]} {...meshProps}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh
            position={vec3ToThree(block.position)}
            rotation={[0, (Math.PI / 4) * 3, 0]}
            {...meshProps}
        >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
    </>
));

export default FlowerMesh;
