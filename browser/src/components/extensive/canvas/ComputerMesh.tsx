import { useFrame } from "@react-three/fiber";
import { clamp } from "lodash";
import { FC, useRef } from "react";
import { useNavigate } from "react-router";
import * as THREE from "three";

import { useUpdatingRef } from "@/hook/useUpdatingRef";
import { TurtleInfo } from "@/lib/devices/types";
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

const TurtleMesh: FC<{
    turtle: TurtleInfo;
    onGetId: (value: number) => void;
}> = ({ turtle, onGetId }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const previousRotationRef = useRef<Rotation | null>(null);
    const turtleRef = useUpdatingRef(turtle);
    const navigate = useNavigate();

    useFrame((_, delta) => {
        const turtle = turtleRef.current;
        const mesh = meshRef.current;
        if (!mesh) return;

        if (turtle.position) {
            const distanceToTarget = mesh.position.distanceTo(turtle.position);
            if (distanceToTarget > 4) {
                mesh.position.x = turtle.position.x;
                mesh.position.y = turtle.position.y;
                mesh.position.z = turtle.position.z;
            } else {
                const MOVE_SPEED = 5;
                mesh.position.x = interpolate(
                    mesh.position.x,
                    turtle.position.x,
                    delta * MOVE_SPEED,
                );
                mesh.position.y = interpolate(
                    mesh.position.y,
                    turtle.position.y,
                    delta * MOVE_SPEED,
                );
                mesh.position.z = interpolate(
                    mesh.position.z,
                    turtle.position.z,
                    delta * MOVE_SPEED,
                );
            }
        }

        const TURN_SPEED = 7.5;
        const rotation = calcRotation(turtle.facing);
        mesh.rotation.y = interpolate(mesh.rotation.y, rotation.y, delta * TURN_SPEED);
    });

    const { position } = turtle;
    if (!position) return null;

    return (
        <mesh
            ref={meshRef}
            scale={0.8}
            onClick={() => navigate(`/turtle/${turtle.id}`)}
            onUpdate={(state) => onGetId(state.id)}
        >
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
    const step = clamp(diff, -speed, speed);
    return current + step;
};

export default TurtleMesh;
