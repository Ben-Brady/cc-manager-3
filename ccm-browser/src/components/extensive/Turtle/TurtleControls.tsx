import { FC } from "react";

import { createTurtleActions } from "@/lib/devices/turtle";
import { TurtleInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";

import CodeInput from "./CodeInput";
import { InventoryDisplay } from "./InventoryDisplay";
import TurtleActionController from "./TurtleActionController";
import TurtleMovemementControls from "./TurtleMovemementControls";

const TurtleControls: FC<{ conn: WsConnection; turtle: TurtleInfo }> = ({ conn, turtle }) => {
    const actions = createTurtleActions(conn, turtle.id);

    return (
        <div className="flex flex-col gap-4 items-center">
            <InventoryDisplay turtle={turtle} actions={actions} />
            <TurtleMovemementControls actions={actions} />
            <TurtleActionController actions={actions} />
            <CodeInput actions={actions} />
        </div>
    );
};

export default TurtleControls;
