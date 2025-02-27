import { FC } from "react";

import { TurtleInfo } from "@/src";

import { createTurtleActions } from "@/lib/devices/turtle";
import { WsConnection } from "@/lib/ws/connection";
import Button from "@/components/elements/Button";
import { InventoryDisplay } from "./InventoryDisplay";
import TurtleActionController from "./TurtleActionController";
import UserCodeRun from "./UserRunCode";

const TurtleControls: FC<{ conn: WsConnection; turtle: TurtleInfo }> = ({ conn, turtle }) => {
    const actions = createTurtleActions(conn, turtle.id);

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-2">
                <Button onClick={actions.scan}>Scan</Button>
                <Button onClick={actions.calibrateRotation}>Calibrate Direction</Button>
            </div>
            <InventoryDisplay turtle={turtle} actions={actions} />
            <TurtleActionController actions={actions} />
            <UserCodeRun actions={actions} />
        </div>
    );
};

export default TurtleControls;
