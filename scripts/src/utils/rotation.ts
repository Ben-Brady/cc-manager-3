import type { Rotation } from "ccm-packet";
import type { Turtle } from "./turtle";

export const rotateByOffset = async (turtle: Turtle, offset: number) => {
    if (offset === 0) return;

    const direction = offset > 0 ? "right" : "left";
    offset = Math.abs(offset);

    for (let i = 0; i < offset; i++) {
        if (direction === "right") await turtle.turnRight();
        if (direction === "left") await turtle.turnLeft();
    }
};

export const getRotationOffset = (a: Rotation, b: Rotation): number => {
    if (a === b) return 0;

    if (a === "-x" && b === "+x") return 2;
    if (a === "+x" && b === "-x") return 2;
    if (a === "-z" && b === "+z") return 2;
    if (a === "+z" && b === "-z") return 2;

    if (a === "-x" && b === "+z") return -1;
    if (a === "-x" && b === "-z") return 1;

    if (a === "+x" && b === "+z") return 1;
    if (a === "+x" && b === "-z") return -1;

    if (a === "-z" && b === "+x") return 1;
    if (a === "-z" && b === "-x") return -1;

    if (a === "+z" && b === "-x") return 1;
    if (a === "+z" && b === "+x") return -1;

    throw new Error("Invalid Rotations");
};
