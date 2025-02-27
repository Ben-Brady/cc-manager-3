import { FC } from "react";

import ArrowImage from "@/assets/images/arrow.png";
import ArrowDownImage from "@/assets/images/arrow-down.png";
import ArrowUpImage from "@/assets/images/arrow-up.png";
import Button from "@/components/elements/Button";
import Container from "@/components/elements/Container";
import { TurtleActions } from "@/lib/devices/turtle";

const MovemementWheel: FC<{
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
                className="size-full flex items-center justify-center col-[1/4]"
                onClick={(e) => onTakeover(e.currentTarget, actions)}
            />
        </Container>
    );
};

const onTakeover = (element: HTMLElement, actions: TurtleActions) => {
    element.requestPointerLock({});

    const controller = new AbortController();

    let isUpPressed = false;
    let isDownPressed = false;

    document.addEventListener(
        "pointerlockchange",
        () => {
            if (document.pointerLockElement === null) {
                controller.abort();
            }
        },
        { signal: controller.signal },
    );
    document.addEventListener(
        "keyup",
        ({ key }) => {
            if (key === "ArrowUp") isUpPressed = false;
            if (key === "ArrowDown") isDownPressed = false;
        },
        { signal: controller.signal },
    );

    document.addEventListener(
        "keydown",
        ({ key }) => {
            if (key === "ArrowUp") isUpPressed = true;
            if (key === "ArrowDown") isDownPressed = true;

            if (key === "s") actions.goBack();
            if (key === "a") actions.turnLeft();
            if (key === "d") actions.turnRight();
            if (key === "w") actions.goForward();
            if (key === " ") actions.goUp();
            if (key === "Shift") actions.goDown();

            if (key === "c") {
                if (isUpPressed) actions.suckUp();
                else if (isDownPressed) actions.suckUp();
                else actions.suckFront();
            }

            if (key === "g") {
                if (isUpPressed) actions.digUp();
                else if (isDownPressed) actions.digDown();
                else actions.digFront();
            }

            if (key === "f") {
                if (isUpPressed) actions.placeUp();
                else if (isDownPressed) actions.placeDown();
                else actions.placeFront();
            }
        },
        { signal: controller.signal },
    );
};

export default MovemementWheel;
