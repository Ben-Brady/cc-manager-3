import { FC, useState } from "react";

import { useComputerInfo } from "../../hook/useComputerInfo";
import { createTurtleActions } from "@/lib/devices/turtle";
import { WsConnection } from "@/lib/ws/connection";
import Button from "../elements/Button";
import Container from "../elements/Container";
import ComputerCanvas from "./canvas/Canvas";
import ComputerSection from "./ComputerInfo";
import MovemementWheel from "./Turtle/MovemementWheel";

type Tab = "devices" | "3d";
const ComputerListing: FC<{ conn: WsConnection }> = ({ conn }) => {
    const { computers, blocks } = useComputerInfo(conn);
    const onPingAll = () => {
        conn.broadcastPacket({ type: "request:heartbeat" });
    };
    const [tab, setTab] = useState<Tab>("devices");

    return (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
            <div className="flex ">
                <Button disabled={tab === "devices"} onClick={() => setTab("devices")}>
                    Devices
                </Button>
                <Button disabled={tab === "3d"} onClick={() => setTab("3d")}>
                    3d Out
                </Button>
            </div>

            <div className="flex flex-col gap-4 max-w-128 w-full">
                {tab === "3d" && (
                    <>
                        <ComputerCanvas computers={computers} blocks={blocks} />

                        {computers
                            .filter((v) => v.type === "turtle")
                            .map((computer) => (
                                <Container
                                    key={computer.id}
                                    className="flex flex-col items-center w-fit"
                                >
                                    <span className="font-minecraft capitalize">
                                        {computer.label ?? `Computer ${computer.id}`}
                                    </span>
                                    <MovemementWheel
                                        actions={createTurtleActions(conn, computer.id)}
                                    />
                                </Container>
                            ))}
                    </>
                )}
                {tab === "devices" && (
                    <>
                        <div className="flex justify-end items-center gap-4 w-full">
                            <span className="font-minecraft">Blocks {blocks.length}</span>
                            <Button onClick={onPingAll}>Refresh All</Button>
                        </div>
                        {computers.map((computer) => (
                            <Container key={computer.id} className="flex gap-12 items-end">
                                <ComputerSection computer={computer} conn={conn} />
                            </Container>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ComputerListing;
