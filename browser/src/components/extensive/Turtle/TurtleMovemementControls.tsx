import { FC } from "react";

import ArrowImage from "@/assets/images/arrow.png";
import ArrowDownImage from "@/assets/images/arrow-down.png";
import ArrowUpImage from "@/assets/images/arrow-up.png";
import DotImage from "@/assets/images/dot.png";
import Button from "@/components/elements/Button";
import Container from "@/components/elements/Container";
import { TurtleActions } from "@/lib/turtle";

const TurtleMovemementControls: FC<{
    actions: TurtleActions;
}> = ({ actions }) => {
    return (
        <Container className="grid gap-0.5 grid-cols-3 grid-rows-3 place-content-center place-items-center size-fit">
            <Button className="size-full flex items-center justify-center" onClick={actions.goUp}>
                <img src={ArrowUpImage} className="size-4 m-0.5" />
            </Button>
            <Button
                className="size-full flex items-center justify-center"
                onClick={actions.goForward}
            >
                <img src={ArrowImage} className="size-4 -rotate-90" />
            </Button>
            <Button className="size-full flex items-center justify-center" onClick={actions.goDown}>
                <img src={ArrowDownImage} className="size-4 m-0.5" />
            </Button>
            <Button
                className="size-full flex items-center justify-center"
                onClick={actions.turnLeft}
            >
                <img src={ArrowImage} className="size-4 rotate-180" />
            </Button>
            <Button className="size-full flex items-center justify-center" onClick={actions.goBack}>
                <img src={ArrowImage} className="size-4 rotate-90" />
            </Button>
            <Button
                className="size-full flex items-center justify-center"
                onClick={actions.turnRight}
            >
                <img src={ArrowImage} className="size-4" />
            </Button>
            <Button
                className="size-full flex items-center justify-center col-span-3"
                onClick={(ev) => {
                    const controller = new AbortController();
                    const { signal } = controller;
                    ev.currentTarget.requestPointerLock();

                    signal.onabort = () => document.exitPointerLock();
                    addKeyboardControls(actions, () => controller.abort(), signal);
                }}
            >
                <img src={DotImage} className="size-4" />
            </Button>
        </Container>
    );
};

const addKeyboardControls = (actions: TurtleActions, onLeave: () => void, signal: AbortSignal) => {
    let isUpPressed = false;
    let isDownPressed = false;

    document.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "ArrowUp") isUpPressed = true;
            if (e.key === "ArrowDown") isDownPressed = true;
            if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
        },
        { signal },
    );

    document.addEventListener(
        "keyup",
        (e) => {
            if (e.key === "ArrowUp") isUpPressed = false;
            if (e.key === "ArrowDown") isDownPressed = false;
            if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
        },
        { signal },
    );

    document.addEventListener(
        "keydown",
        (e) => {
            const key = e.key;
            if (key === "Escape") {
                onLeave();
                return;
            }
            e.preventDefault();

            if (e.key === "w") actions.goForward();
            if (e.key === "s") actions.goBack();
            if (e.key === "a") actions.turnLeft();
            if (e.key === "d") actions.turnRight();

            if (e.key === " ") actions.goUp();
            if (e.key === "Shift") actions.goDown();

            if (e.key === "c") {
                if (isUpPressed) actions.suckUp();
                else if (isDownPressed) actions.suckUp();
                else actions.suckFront();
            }

            if (e.key === "g") {
                if (isUpPressed) actions.digUp();
                else if (isDownPressed) actions.digDown();
                else actions.digFront();
            }

            if (e.key === "f") {
                if (isUpPressed) actions.placeUp();
                else if (isDownPressed) actions.placeDown();
                else actions.placeFront();
            }
            e.stopPropagation();
        },
        { signal },
    );
};

export default TurtleMovemementControls;
