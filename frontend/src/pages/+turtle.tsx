import { FC } from "react";
import { useParams } from "react-router";

import TurtleFullControls from "@/components/extensive/Controls/TurtleFullControls";
import WorldCanvas from "@/components/extensive/Canvas/WorldCanvas";
import { useConnectionContext } from "@/context/ConnectionProvider";
import { TurtleInfo } from "@/lib/devices/types";
import Container from "@/components/elements/Container";

const CanvasPage: FC = () => {
    const { conn, blocks, computers } = useConnectionContext();
    const params = useParams();

    const id = parseInt(params.id as string);
    const turtles = computers.filter((v) => v.type === "turtle") as TurtleInfo[];
    const turtle = turtles.find((v) => v.id === id);

    if (!turtle) return null;

    return (
        <Container className="flex gap-4 max-w-192 w-full">
            <div className="flex flex-col gap-4 items-center w-full">
                <WorldCanvas computerId={id} computers={computers} blocks={blocks} />
                <TurtleFullControls conn={conn} turtle={turtle} />
            </div>
        </Container>
    );
};

export default CanvasPage;
