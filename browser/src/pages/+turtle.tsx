import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import CanvasControls from "@/components/extensive/canvas/TurtleControls";
import WorldCanvas from "@/components/extensive/canvas/WorldCanvas";
import { useConnectionContext } from "@/context/ConnectionProvider";
import { TurtleInfo } from "@/lib/devices/types";

const CanvasPage: FC = () => {
    const { conn, blocks, computers } = useConnectionContext();
    const params = useParams();

    const id = parseInt(params.id as string);
    const turtles = computers.filter((v) => v.type === "turtle") as TurtleInfo[];
    const turtle = turtles.find((v) => v.id === id);

    if (!turtle) return null;

    return (
        <div className="flex flex-col gap-4 max-w-192 items-center w-full">
            <WorldCanvas turtle={turtle} computers={computers} blocks={blocks} />

            <CanvasControls conn={conn} turtle={turtle} />
        </div>
    );
};

export default CanvasPage;
