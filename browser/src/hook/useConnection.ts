import { useEffect, useState } from "react";

import { connectToProxy, WsConnection } from "@/lib/ws/connection";

export const useConnection = (): WsConnection | undefined => {
    const [conn, setConn] = useState<WsConnection | undefined>(undefined);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            const conn = await connectToProxy("ws://localhost:8000/ws/client");
            signal.onabort = () => conn.close();
            setConn(conn);
        })();

        return () => {
            controller.abort();
            setConn(undefined);
        };
    }, []);

    return conn;
};
