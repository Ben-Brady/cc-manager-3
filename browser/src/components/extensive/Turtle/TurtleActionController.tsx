import { FC } from "react";

import DotImage from "@/assets/images/dot.png";
import Button from "@/components/elements/Button";
import type { TurtleActions } from "@/lib/devices/turtle";

import DirectionalActions from "./DirectionalActions";

const TurtleActionController: FC<{ actions: TurtleActions }> = ({ actions }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-fit justify-around gap-6">
                <DirectionalActions
                    title="Mine"
                    onForward={actions.digFront}
                    onUp={actions.digUp}
                    onDown={actions.digDown}
                />
                <DirectionalActions
                    title="Place"
                    onForward={actions.placeFront}
                    onUp={actions.placeUp}
                    onDown={actions.placeDown}
                />
                <DirectionalActions
                    title="Drop"
                    onForward={actions.dropFront}
                    onUp={actions.dropUp}
                    onDown={actions.dropDown}
                />
                <DirectionalActions
                    title="Suck"
                    onForward={actions.suckFront}
                    onUp={actions.suckUp}
                    onDown={actions.suckDown}
                />
                <DirectionalActions
                    title="Inspect"
                    onForward={actions.inspectFront}
                    onUp={actions.inspectUp}
                    onDown={actions.inspectDown}
                />
            </div>
            <div className="flex flex-col flex-wrap gap-2 h-24">
                <ActionButton
                    title="Refuel"
                    onClick={() => actions.eval([], "turtle.refuel(64)")}
                />
                <ActionButton title="Scan" onClick={() => actions.scan(10)} />
                <ActionButton title="Restart" onClick={() => actions.restart()} />
            </div>
        </div>
    );
};

const ActionButton: FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
    <div className="flex gap-2">
        <span className="font-minecraft w-16 text-right">{title}</span>
        <Button className="h-fit flex justify-center w-10" onClick={onClick}>
            <img src={DotImage} className="-rotate-90  size-4" />
        </Button>
    </div>
);

export default TurtleActionController;
