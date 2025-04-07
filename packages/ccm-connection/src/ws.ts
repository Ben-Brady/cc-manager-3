import { RequestBody, RequestPacket, ResponsePacket } from "ccm-packet";
import { WebSocket } from "@libsql/isomorphic-ws";

export type WsConnection = {
    sendPacket: (destination: number | "*", packet: RequestBody) => void;
    onPacket: (callback: PacketCallback, signal?: AbortSignal) => void;
    disconnect: () => void;
};

type PacketCallback = (packet: ResponsePacket) => void;

export const connectToProxy = async (hostname: string): Promise<WsConnection> => {
    const controller = new AbortController();
    const signal = controller.signal;

    let ws: WebSocket | undefined;

    const disconnect: WsConnection["disconnect"] = () => {
        controller.abort();
    };

    let packetCallbacks: PacketCallback[] = [];
    const onPacket: WsConnection["onPacket"] = (callback, signal = undefined) => {
        const packetCallback: PacketCallback = callback;
        packetCallbacks.push(packetCallback);
        signal?.addEventListener("abort", () => {
            packetCallbacks = packetCallbacks.filter((v) => v !== packetCallback);
        });
    };

    const sendPacket: WsConnection["sendPacket"] = (destination, body) => {
        if (!ws) throw new Error("WebSocket not open");
        const data = { destination, body } satisfies RequestPacket;
        const packet = JSON.stringify(data);
        ws.send(packet);
    };

    const connect = async () => {
        let newWs = new WebSocket(hostname + "/ws/client");
        await waitForWebsocketConnection(newWs);
        ws = newWs;

        ws.onmessage = async (e) => {
            if (typeof e.data !== "string") return undefined;

            const data = JSON.parse(e.data);
            const packet = ResponsePacket.parse(data);

            packetCallbacks.map(async (callback) => {
                try {
                    callback(packet);
                } catch (e) {
                    console.error(e);
                }
            });
        };

        // Prevent reconnection when closing
        signal.addEventListener("abort", () => {
            if (ws) {
                ws.close();
            }
            ws = undefined;
        });

        ws.addEventListener("close", connect, { once: true });
    };
    await connect();
    return { onPacket, sendPacket, disconnect };
};

const waitForWebsocketConnection = (ws: WebSocket): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        ws.addEventListener("open", () => resolve());
        ws.addEventListener("error", () => reject());
    });
};
