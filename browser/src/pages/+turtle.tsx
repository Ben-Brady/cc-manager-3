import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import ComputerCanvas from "@/components/extensive/canvas/Canvas";
import CanvasControls from "@/components/extensive/canvas/CanvasControls";
import { useConnectionContext } from "@/context/ConnectionProvider";

const CanvasPage: FC = () => {
    const { conn, blocks, computers } = useConnectionContext();
    const params = useParams();
    const navigate = useNavigate();

    const id = parseInt(params.id as string);
    const turtle = computers.filter((v) => v.type === "turtle").find((v) => v.id === id);

    useEffect(() => {
        if (!turtle) navigate("/");
    }, [turtle, navigate]);

    if (!turtle) return null;

    return (
        <div className="flex flex-col gap-4 max-w-192 items-center w-full">
            <ComputerCanvas turtle={turtle} computers={computers} blocks={blocks} />
            <CanvasControls conn={conn} turtle={turtle} />
        </div>
    );
};

export default CanvasPage;
