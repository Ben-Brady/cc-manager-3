import classNames from "classnames";
import { FC } from "react";

import { useSecondsSince } from "../../hook/useSecondsSince";
import { createTurtleActions } from "@/lib/devices/turtle";
import { ComputerInfo } from "@/lib/devices/types";
import { formatDuration } from "@/lib/format";
import { WsConnection } from "@/lib/ws/connection";
import Button from "../elements/Button";
import TurtleControls from "./Turtle/TurtleControls";

const TIMEOUT = 5;

const ComputerSection: FC<{ computer: ComputerInfo; conn: WsConnection }> = ({
    computer,
    conn,
}) => {
    const { id, label, type, position } = computer;
    const secondsSinceUpdate = useSecondsSince(new Date(computer.lastUpdated)) ?? 0;

    const uptime = (secondsSinceUpdate ?? 0) + computer.uptime;
    const isLagging = !!secondsSinceUpdate && secondsSinceUpdate > TIMEOUT;

    const actions = createTurtleActions(conn, computer.id);

    return (
        <div className={classNames("flex flex-col w-full duration-300", isLagging && "opacity-50")}>
            <div className="flex justify-between items-center">
                <span className="font-minecraft capitalize">
                    {label ? `${label}(${id})` : `ID ${id}`} | {type}
                </span>
                <span className="font-minecraft text-center">
                    {position?.x ?? "?"}, {position?.y ?? "?"}, {position?.z ?? "?"} |{" "}
                    {computer.type === "turtle" ? computer.facing ?? "?" : "?"}
                </span>
                <span className="font-minecraft capitalize text-end">
                    {formatDuration(uptime)} Uptime
                </span>
            </div>
            <div className="flex flex-col justify-between mt-4 gap-2">
                    <Button onClick={actions.restart}>Restart</Button>
                    {computer.type === "turtle" && (
                        <>
                            <TurtleControls conn={conn} turtle={computer} />
                        </>
                    )}
            </div>
        </div>
    );
};

export default ComputerSection;
