import { FC } from "react";

import { ComputerInfo } from "@/lib/devices/types";
import { useSecondsSince } from "@/hook/useSecondsSince";
import { formatDuration } from "@/lib/format";

const ComputerBanner: FC<{ computer: ComputerInfo }> = ({ computer }) => {
    const { label, id, type, position } = computer;

    const secondsSinceUpdate = useSecondsSince(new Date(computer.lastUpdated)) ?? 0;
    const uptime = (secondsSinceUpdate ?? 0) + computer.uptime;

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between w-full">
                <div className="font-minecraft capitalize flex flex-col">
                    <span>{label ? `${label}(${id})` : `ID ${id}`}</span>
                    <span>
                        {type} {computer.type == "turtle" && ` | ${computer.fuel} Fuel`}
                    </span>
                </div>
                <div className="font-minecraft text-center flex flex-col">
                    <span className="text-center">
                        {position?.x ?? "?"}, {position?.y ?? "?"}, {position?.z ?? "?"}
                    </span>
                    <span className="text-center">
                        {computer.type === "turtle" ? computer.facing ?? "?" : "?"}
                    </span>
                </div>
                <span className="font-minecraft capitalize text-end">
                    {formatDuration(uptime)} Uptime
                </span>
            </div>
        </div>
    );
};

export default ComputerBanner;
