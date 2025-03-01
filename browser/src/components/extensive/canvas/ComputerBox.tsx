import { FC } from "react";

import { ComputerInfo } from "@/lib/devices/types";

import { vectorToArray } from "./Canvas";

const ComputerBox: FC<{ computer: ComputerInfo }> = ({ computer }) => {
    const { position } = computer;
    if (!position) return null;

    const color = (() => {
        if (computer.type === "computer") return "#37ffa1";
        if (computer.type === "turtle") return "#ff9837";
        if (computer.type === "pocket") return "#ff37e4";
    })();

    return (
        <mesh position={vectorToArray(position)} scale={1}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export default ComputerBox;
