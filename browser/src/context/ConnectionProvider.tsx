import { Block, useBlocks } from "@/hook/useBlocks";
import { useComputers } from "@/hook/useComputers";
import { useConnection } from "@/hook/useConnection";
import { ComputerInfo } from "@/lib/devices/types";
import { WsConnection } from "@/lib/ws/connection";
import { createContext, FC, ReactNode, useContext } from "react";

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

    const value = { conn, blocks, computers };
    return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};
