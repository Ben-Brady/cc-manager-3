import { FC, Fragment, memo } from "react";

import { THREE } from "@/lib/three";
import { toStringVec3, toVec3Array } from "@/lib/three/utils";

import { MeshProps } from "./BlockMeshes";
import { MISSING_TEXTURE } from "@/lib/three/loader";

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

    "minecraft:tall_seagrass",
    "minecraft:seagrass",
    "minecraft:torch",
    "minecraft:wall_torch",
    "minecraft:lever",
];
export const isFlower = (name: string) => FLOWER_NAMES.includes(name);

const FlowerMesh: FC<MeshProps> = ({ texture, blockName, positions, meshProps }) => (
    <>
        {positions.map((pos) => (
            <Fragment key={toStringVec3(pos) + blockName}>
                <mesh position={toVec3Array(pos)} rotation={[0, Math.PI / 4, 0]} {...meshProps}>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        map={texture ?? MISSING_TEXTURE}
                        side={THREE.DoubleSide}
                        transparent
                    />
                </mesh>
                <mesh
                    position={toVec3Array(pos)}
                    rotation={[0, (Math.PI / 4) * 3, 0]}
                    {...meshProps}
                >
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        map={texture ?? MISSING_TEXTURE}
                        side={THREE.DoubleSide}
                        transparent
                    />
                </mesh>
            </Fragment>
        ))}
    </>
);

export default FlowerMesh;
