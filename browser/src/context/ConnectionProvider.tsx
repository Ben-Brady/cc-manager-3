import { createContext, FC, ReactNode, useContext } from "react";

import { Block, useBlocks } from "@/hook/useBlocks";
import { useComputers } from "@/hook/useComputers";
import { useConnection } from "@/hook/useConnection";
import { ComputerInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";

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
    const blocks = useBlocks(conn);
    const computers = useComputers(conn);
    if (!conn) return "Loading...";

    return (
        <ConnectionContext.Provider value={{ conn, blocks, computers }}>
            {children}
        </ConnectionContext.Provider>
    );
};
