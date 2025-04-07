import { WsConnection } from "ccm-connection";
import { Block } from "ccm-packet";
import { createContext, FC, ReactNode, useContext } from "react";

import { useConnection } from "@/hook/useConnection";
import { useMemory } from "@/hook/useMemory";
import { ComputerInfo } from "@/lib/devices/types";

type ConnectionContextType = {
    conn: WsConnection;
    blocks: Record<string, Block>;
    computers: ComputerInfo[];
};

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const useConnectionContext = (): ConnectionContextType => {
    const value = useContext(ConnectionContext);
    if (!value) throw new Error("Not in ConnectionContext");
    return value;
};

export const ConnectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const conn = useConnection();
    const { blocks, devices } = useMemory(conn);
    if (!conn) {
        return <div className="size-full flex items-center justify-center">Loading...</div>;
    }

    const computers = Object.values(devices);
    return (
        <ConnectionContext.Provider value={{ conn, blocks, computers }}>
            {children}
        </ConnectionContext.Provider>
    );
};
