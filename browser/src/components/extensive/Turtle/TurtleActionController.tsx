import { FC } from "react";

import type { TurtleActions } from "@/lib/devices/turtle";
import DirectionalActions from "./DirectionalActions";
import TurtleMovemementControls from "./TurtleMovemementControls";

const TurtleActionController: FC<{ actions: TurtleActions }> = ({ actions }) => {
    return (
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
    );
};

export default TurtleActionController;
