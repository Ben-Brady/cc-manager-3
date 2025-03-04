import { FC } from "react";

import Button from "@/components/elements/Button";
import Container from "@/components/elements/Container";
import ComputerSection from "@/components/extensive/ComputerInfo";
import { useConnectionContext } from "@/context/ConnectionProvider";

const ListingPage: FC = () => {
    const { conn, computers, blocks } = useConnectionContext();

    const onPingAll = () => {
        conn.broadcastPacket({ type: "request:heartbeat" });
    };

    return (
        <div className="flex flex-col gap-4 max-w-128 w-full">
            <div className="flex justify-end items-center gap-4 w-full">
                <span className="font-minecraft">Blocks {blocks.length}</span>
                <Button onClick={onPingAll}>Refresh All</Button>
            </div>
            {computers.map((computer) => (
                <Container key={computer.id} className="flex gap-12 items-end">
                    <ComputerSection computer={computer} />
                </Container>
            ))}
        </div>
    );
};

export default ListingPage;
