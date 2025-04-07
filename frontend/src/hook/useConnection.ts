import { connectToProxy, WsConnection } from "ccm-connection";
import { useEffect, useState } from "react";

export const useConnection = (): WsConnection | undefined => {
    const [conn, setConn] = useState<WsConnection | undefined>(undefined);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            const conn = await connectToProxy("ws://localhost:8000");
            signal.onabort = () => conn.disconnect();
            setConn(conn);
        })();

        return () => {
            controller.abort();
            setConn(undefined);
        };
    }, []);

    return conn;
};
