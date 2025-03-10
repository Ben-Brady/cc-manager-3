import classNames from "classnames";
import { FC } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/elements/Button";
import { useSecondsSince } from "@/hook/useSecondsSince";
import { ComputerInfo } from "@/lib/devices/types";

import ComputerBanner from "./Turtle/ComputerBanner";
import { InventoryDisplay } from "./Turtle/InventoryDisplay";

const TIMEOUT = 5;

const ComputerSection: FC<{ computer: ComputerInfo }> = ({ computer }) => {
    const secondsSinceUpdate = useSecondsSince(new Date(computer.lastUpdated)) ?? 0;
    const isLagging = !!secondsSinceUpdate && secondsSinceUpdate > TIMEOUT;
    const navigate = useNavigate();

    return (
        <div className={classNames("flex flex-col w-full duration-300", isLagging && "opacity-50")}>
            <div className="flex flex-col justify-between items-center gap-4">
                <ComputerBanner computer={computer} />
                <Button onClick={() => navigate(`/turtle/${computer.id}`)}>Take Control</Button>
                {computer.type === "turtle" && <InventoryDisplay turtle={computer} />}
            </div>
        </div>
    );
};

export default ComputerSection;
