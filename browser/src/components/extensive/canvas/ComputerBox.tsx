import { FC } from "react";
import * as THREE from "three";

import { ComputerInfo } from "@/lib/devices/types";

import {
    TURTLE_BACK_URL,
    TURTLE_BOTTOM_URL,
    TURTLE_FRONT_URL,
    TURTLE_LEFT_URL,
    TURTLE_RIGHT_URL,
    TURTLE_TOP_URL,
} from "./assets";
import { vectorToArray } from "./Canvas";

const loader = new THREE.TextureLoader();

const loadTexture = (url: string) => {
    const texture = loader.load(url);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Pixelate
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return texture;
};
const TURTLE_BACK_TEXTURE = loadTexture(TURTLE_BACK_URL);
const TURTLE_BOTTOM_TEXTURE = loadTexture(TURTLE_BOTTOM_URL);
const TURTLE_FRONT_TEXTURE = loadTexture(TURTLE_FRONT_URL);
const TURTLE_LEFT_TEXTURE = loadTexture(TURTLE_LEFT_URL);
const TURTLE_RIGHT_TEXTURE = loadTexture(TURTLE_RIGHT_URL);
const TURTLE_TOP_TEXTURE = loadTexture(TURTLE_TOP_URL);

const ComputerBox: FC<{ computer: ComputerInfo }> = ({ computer }) => {
    const { position } = computer;
    if (!position) return null;

    const rotation = new THREE.Euler();
    const quaterTurn = -(Math.PI / 2);
    if (computer.type === "turtle" && computer.facing) {
        if (computer.facing === "north") rotation.y = quaterTurn * -1;
        if (computer.facing === "east") rotation.y = quaterTurn * 0;
        if (computer.facing === "south") rotation.y = quaterTurn * 1;
        if (computer.facing === "west") rotation.y = quaterTurn * 2;
    }

    return (
        <mesh position={vectorToArray(position)} scale={0.8} rotation={rotation}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={TURTLE_LEFT_TEXTURE} attach="material-5" />
            <meshStandardMaterial map={TURTLE_BOTTOM_TEXTURE} attach="material-3" />
            <meshStandardMaterial map={TURTLE_RIGHT_TEXTURE} attach="material-4" />
            <meshStandardMaterial map={TURTLE_TOP_TEXTURE} attach="material-2" />
            <meshStandardMaterial map={TURTLE_BACK_TEXTURE} attach="material-1" />
            <meshStandardMaterial map={TURTLE_FRONT_TEXTURE} attach="material-0" />
        </mesh>
    );
};

export default ComputerBox;
