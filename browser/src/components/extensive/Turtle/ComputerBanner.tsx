import { FC } from "react";

import { ComputerInfo } from "@/lib/devices/types";
import { useSecondsSince } from "@/hook/useSecondsSince";
import { formatDuration } from "@/lib/format";

const ComputerBanner: FC<{ computer: ComputerInfo }> = ({ computer }) => {
    const { label, id, type, position } = computer;

    const secondsSinceUpdate = useSecondsSince(new Date(computer.lastUpdated)) ?? 0;
    const uptime = (secondsSinceUpdate ?? 0) + computer.uptime;

    return (
        <div className="flex justify-between items-center w-full">
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
    );
};

export default ComputerBanner;
