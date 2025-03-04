import { FC, useState } from "react";

import RedstoneIcon from "@/assets/images/icons/redstone.png";
import PocketComputerIcon from "@/assets/images/icons/pocket.png";
import ComputerBanner from "@/components/extensive/Turtle/ComputerBanner";
import { InventoryDisplay } from "@/components/extensive/Turtle/InventoryDisplay";
import TurtleActionController from "@/components/extensive/Turtle/TurtleActionController";
import TurtleMovemementControls from "@/components/extensive/Turtle/TurtleMovemementControls";
import { createTurtleActions } from "@/lib/devices/turtle";
import { TurtleInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";
import TabContainer from "@/components/elements/TabsContainer";
import CodeInput from "../Turtle/CodeInput";

type Tab = "redstone" | "code";
const CanvasControls: FC<{ conn: WsConnection; turtle: TurtleInfo }> = ({ conn, turtle }) => {
    const actions = createTurtleActions(conn, turtle.id);
    const [tab, setTab] = useState<Tab>("redstone");

    return (
        <TabContainer
            currentTab={tab}
            tabs={[
                { name: "redstone", icon: RedstoneIcon },
                { name: "code", icon: PocketComputerIcon },
            ]}
            onChangeTab={(tab) => setTab(tab)}
            containerClassname="w-full"
            className="flex flex-col items-center gap-4"
        >
            <ComputerBanner computer={turtle} />
            {tab === "redstone" && (
                <div className="flex gap-8 justify-center w-full">
                    <div className="flex flex-col gap-4 items-center">
                        <TurtleMovemementControls actions={actions} />
                        <TurtleActionController actions={actions} />
                    </div>
                    <InventoryDisplay turtle={turtle} actions={actions} />
                </div>
            )}
            {tab === "code" && <CodeInput actions={actions} />}
        </TabContainer>
    );
};

export default CanvasControls;
