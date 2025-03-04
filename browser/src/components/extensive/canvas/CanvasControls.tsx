import { FC } from "react";

import Container from "@/components/elements/Container";
import ComputerBanner from "@/components/extensive/Turtle/ComputerBanner";
import { InventoryDisplay } from "@/components/extensive/Turtle/InventoryDisplay";
import TurtleActionController from "@/components/extensive/Turtle/TurtleActionController";
import TurtleMovemementControls from "@/components/extensive/Turtle/TurtleMovemementControls";
import { createTurtleActions } from "@/lib/devices/turtle";
import { TurtleInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";

const CanvasControls: FC<{ conn: WsConnection; turtle: TurtleInfo }> = ({ conn, turtle }) => {
    const actions = createTurtleActions(conn, turtle.id);

    return (
        <Container className="flex flex-col items-center w-full gap-4">
            <ComputerBanner computer={turtle} />
            <div className="flex gap-8 justify-center w-full">
                <div className="flex flex-col gap-4 items-center">
                    <TurtleMovemementControls actions={actions} />
                    <TurtleActionController actions={actions} />
                </div>
                <InventoryDisplay turtle={turtle} actions={actions} />
            </div>
        </Container>
    );
};

export default CanvasControls;
