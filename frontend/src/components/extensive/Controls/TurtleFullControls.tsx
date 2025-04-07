import classNames from "classnames";
import { FC, useState } from "react";

import PocketComputerIcon from "@/assets/images/icons/pocket.png";
import RedstoneIcon from "@/assets/images/icons/redstone.png";
import TabContainer from "@/components/elements/TabsContainer";
import ComputerBanner from "@/components/extensive/Turtle/ComputerBanner";
import { InventoryDisplay } from "@/components/extensive/Turtle/InventoryDisplay";
import TurtleActionController from "@/components/extensive/Turtle/TurtleActionController";
import TurtleMovemementControls from "@/components/extensive/Turtle/TurtleMovemementControls";
import { useSecondsSince } from "@/hook/useSecondsSince";
import { wrapTurtleActions } from "@/lib/turtle";
import { TurtleInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";

import CodeInput from "../Turtle/CodeInput";

type Tab = "redstone" | "code" | "inventory";
const TurtleFullControls: FC<{ conn: WsConnection; turtle: TurtleInfo }> = ({ conn, turtle }) => {
    const actions = wrapTurtleActions(conn, turtle.id);
    const [tab, setTab] = useState<Tab>("redstone");
    const sinceLastUpdate = useSecondsSince(new Date(turtle.lastUpdated));

    return (
        <TabContainer
            currentTab={tab}
            tabs={[
                { name: "redstone", icon: RedstoneIcon },
                { name: "inventory", icon: PocketComputerIcon },
                { name: "code", icon: PocketComputerIcon },
            ]}
            onChangeTab={(tab) => setTab(tab)}
            containerClassname="w-full h-full"
            className={classNames("flex flex-col items-center gap-4", {
                "opacity-50": sinceLastUpdate && sinceLastUpdate > 2,
            })}
        >
            <ComputerBanner computer={turtle} />
            {tab === "redstone" && (
                <div className="flex gap-8 justify-center w-full flex-wrap">
                    <div className="flex flex-row gap-4">
                        <TurtleMovemementControls actions={actions} />
                        <TurtleActionController actions={actions} />
                    </div>
                </div>
            )}
            {tab === "inventory" && <InventoryDisplay turtle={turtle} actions={actions} />}
            {tab === "code" && <CodeInput actions={actions} />}
        </TabContainer>
    );
};

export default TurtleFullControls;
