import { useFrame } from "@react-three/fiber";
import { clamp } from "lodash";
import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import * as THREE from "three";

import { TurtleInfo } from "@/lib/devices/types";
import { Vec3 } from "@/lib/packet";
import { Rotation } from "@/lib/packet/generic";
import { loadTexture } from "@/lib/three/loader";

import {
    TURTLE_BACK_URL,
    TURTLE_BOTTOM_URL,
    TURTLE_FRONT_URL,
    TURTLE_LEFT_URL,
    TURTLE_RIGHT_URL,
    TURTLE_TOP_URL,
} from "./assets";

const TURTLE_BACK_TEXTURE = loadTexture(TURTLE_BACK_URL);
const TURTLE_BOTTOM_TEXTURE = loadTexture(TURTLE_BOTTOM_URL);
const TURTLE_FRONT_TEXTURE = loadTexture(TURTLE_FRONT_URL);
const TURTLE_LEFT_TEXTURE = loadTexture(TURTLE_LEFT_URL);
const TURTLE_RIGHT_TEXTURE = loadTexture(TURTLE_RIGHT_URL);
const TURTLE_TOP_TEXTURE = loadTexture(TURTLE_TOP_URL);

const TurtleMesh: FC<{ turtle: TurtleInfo }> = ({ turtle }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const targetPositionRef = useRef<Vec3>(turtle.position);
    const targetRotationRef = useRef<THREE.Euler>(undefined);
    const navigate = useNavigate();

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const targetPos = targetPositionRef.current;
        if (targetPos) {
            const isInitialPosiiton =
                mesh.position.x === 0 && mesh.position.y === 0 && mesh.position.x === 0;

            if (isInitialPosiiton) {
                mesh.position.x = targetPos.x;
                mesh.position.y = targetPos.y;
                mesh.position.z = targetPos.z;
                return;
            }

            mesh.position.x = interpolate(mesh.position.x, targetPos.x, delta * 3);
            mesh.position.y = interpolate(mesh.position.y, targetPos.y, delta * 3);
            mesh.position.z = interpolate(mesh.position.z, targetPos.z, delta * 3);
        }

        const targetRot = targetRotationRef.current;
        if (targetRot) {
            mesh.rotation.y = interpolate(mesh.rotation.y, targetRot.y, delta * 10);
        }
    });

    useEffect(() => {
        let position = turtle.position;
        if (position) targetPositionRef.current = position;

        let rotation = calcRotation(turtle.facing);
        if (rotation) targetRotationRef.current = rotation;
    }, [turtle]);

    const { position } = turtle;
    if (!position) return null;

    return (
        <mesh ref={meshRef} scale={0.8} onClick={() => navigate(`/turtle/${turtle.id}`)}>
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

const QUARTER_TURN = -(Math.PI / 2);
const calcRotation = (facing: undefined | Rotation): THREE.Euler => {
    const rotation = new THREE.Euler();
    if (facing === "north") rotation.y = QUARTER_TURN * -1;
    if (facing === "east") rotation.y = QUARTER_TURN * 0;
    if (facing === "south") rotation.y = QUARTER_TURN * 1;
    if (facing === "west") rotation.y = QUARTER_TURN * 2;
    return rotation;
};

const interpolate = (current: number, target: number, speed: number) => {
    const diff = target - current;
    const step = diff < 1 ? clamp(diff, -speed, speed) : diff;
    return current + step;
};

export default TurtleMesh;
