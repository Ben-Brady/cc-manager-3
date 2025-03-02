import { FC } from "react";

import Container from "@/components/elements/Container";
import ComputerCanvas from "@/components/extensive/canvas/Canvas";
import { useConnectionContext } from "@/context/ConnectionProvider";
import { createTurtleActions } from "@/lib/devices/turtle";
import { TurtleInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";

import { InventoryDisplay } from "./Turtle/InventoryDisplay";
import TurtleActionController from "./Turtle/TurtleActionController";

const CanvasPage: FC = () => {
    const { conn, blocks, computers } = useConnectionContext();

    return (
        <div className="flex flex-col gap-4 max-w-128 w-full">
            <ComputerCanvas computers={computers} blocks={blocks} />

            {computers
                .filter((v) => v.type === "turtle")
                .map((turtle) => (
                    <CanvasControls key={turtle.id} conn={conn} turtle={turtle} />
                ))}
        </div>
    );
};

const CanvasControls: FC<{ conn: WsConnection; turtle: TurtleInfo }> = ({ conn, turtle }) => {
    const actions = createTurtleActions(conn, turtle.id);

    return (
        <Container className="flex flex-col items-center w-fit">
            <span className="font-minecraft capitalize">
                {turtle.label ?? `Computer ${turtle.id}`}
            </span>

            <div className="flex flex-col gap-4 i">
                <TurtleActionController actions={actions} />
                <InventoryDisplay turtle={turtle} actions={actions} />
            </div>
        </Container>
    );
};

export default CanvasPage;
