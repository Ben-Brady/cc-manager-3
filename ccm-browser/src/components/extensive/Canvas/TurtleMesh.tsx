import { useFrame } from "@react-three/fiber";
import { clamp } from "lodash";
import { FC, RefObject, useRef } from "react";
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
import { toVector3 } from "@/lib/three/utils";

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
    const turtleRef = useUpdatingRef(turtle);
    const navigate = useNavigate();

    const TURN_SPEED = 7.5;
    const MOVE_SPEED = 5;
    const MAX_DISTANCE = 4;
    useTurtlePosition(meshRef, turtleRef, MOVE_SPEED, MAX_DISTANCE);
    useTurtleRotation(meshRef, turtleRef, TURN_SPEED);

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

const useTurtlePosition = (
    meshRef: RefObject<THREE.Mesh | null>,
    turtleRef: RefObject<TurtleInfo>,
    speed: number,
    maxDistance: number,
) => {
    useFrame((_, delta) => {
        const mesh = meshRef.current;
        const target = turtleRef.current.position;
        if (!mesh || !target) return;

    const distanceToTarget = mesh.position.distanceTo(target);
        if (distanceToTarget > maxDistance) {
            mesh.position.x = target.x;
            mesh.position.y = target.y;
            mesh.position.z = target.z;
        } else {
            mesh.position.x = interpolate(mesh.position.x, target.x, delta * speed);
            mesh.position.y = interpolate(mesh.position.y, target.y, delta * speed);
            mesh.position.z = interpolate(mesh.position.z, target.z, delta * speed);
        }
    });
};

const useTurtleRotation = (
    meshRef: RefObject<THREE.Mesh | null>,
    turtleRef: RefObject<TurtleInfo>,
    speed: number,
) => {
    const previousFacingRef = useRef<Rotation | undefined>(undefined);
    const targetRotationRef = useRef(0);

    useFrame((_, delta) => {
        const turtle = turtleRef.current;
        const mesh = meshRef.current;
        if (!mesh) return;

        const rotation = calcRotation(turtle.facing, previousFacingRef.current);

        previousFacingRef.current = turtle.facing;
        targetRotationRef.current += rotation;

        mesh.rotation.y = interpolate(mesh.rotation.y, targetRotationRef.current, delta * speed);
    });
};

const QUARTER_TURN = -(Math.PI / 2);
const calcRotation = (facing: undefined | Rotation, prevFacing: undefined | Rotation): number => {
    if (facing && !prevFacing) {
        if (facing === "north") return QUARTER_TURN * -1;
        if (facing === "east") return QUARTER_TURN * 0;
        if (facing === "south") return QUARTER_TURN * 1;
        if (facing === "west") return QUARTER_TURN * 2;
    } else if (facing && prevFacing) {
        // 180 Turn
        if (facing === "north" && prevFacing === "south") return QUARTER_TURN * 2;
        if (facing === "south" && prevFacing === "north") return QUARTER_TURN * 2;
        if (facing === "east" && prevFacing === "west") return QUARTER_TURN * 2;
        if (facing === "west" && prevFacing === "east") return QUARTER_TURN * 2;

        // 90 Turn
        if (facing === "north" && prevFacing === "east") return -QUARTER_TURN;
        if (facing === "north" && prevFacing === "west") return QUARTER_TURN;
        if (facing === "south" && prevFacing === "east") return QUARTER_TURN;
        if (facing === "south" && prevFacing === "west") return -QUARTER_TURN;
        if (facing === "east" && prevFacing === "north") return QUARTER_TURN;
        if (facing === "east" && prevFacing === "south") return -QUARTER_TURN;
        if (facing === "west" && prevFacing === "north") return -QUARTER_TURN;
        if (facing === "west" && prevFacing === "south") return QUARTER_TURN;

        // 0 degree turn
        if (facing === prevFacing) return 0;
    }

    return 0;
};

export const interpolate = (current: number, target: number, speed: number) => {
    const diff = target - current;
    const step = clamp(diff, -speed, speed);
    return current + step;
};

export default TurtleMesh;
