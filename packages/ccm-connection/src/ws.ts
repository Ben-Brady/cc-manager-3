import { RequestBody, RequestPacket, ResponsePacket } from "ccm-packet";
import { WebSocket } from "@libsql/isomorphic-ws";

export type WsConnection = {
    sendPacket: (destination: number | "*", packet: RequestBody) => void;
    onPacket: (callback: PacketReceiveCallback, signal?: AbortSignal) => void;
    onPacketSent: (callback: PacketSendCallback, signal?: AbortSignal) => void;
    disconnect: () => void;
};

type PacketSendCallback = (packet: RequestPacket) => void;
type PacketReceiveCallback = (packet: ResponsePacket) => void;

export const connectToProxy = async (hostname: string): Promise<WsConnection> => {
    const controller = new AbortController();
    const signal = controller.signal;

    let ws: WebSocket | undefined;

    const disconnect: WsConnection["disconnect"] = () => {
        controller.abort();
    };

    let packetSentCallbacks: PacketSendCallback[] = [];
    const onPacketSent: WsConnection["onPacketSent"] = (callback, signal = undefined) => {
        const packetCallback: PacketSendCallback = callback;
        packetSentCallbacks.push(packetCallback);
        signal?.addEventListener("abort", () => {
            packetSentCallbacks = packetSentCallbacks.filter((v) => v !== packetCallback);
        });
    };

    let packetCallbacks: PacketReceiveCallback[] = [];
    const onPacket: WsConnection["onPacket"] = (callback, signal = undefined) => {
        const packetCallback: PacketReceiveCallback = callback;
        packetCallbacks.push(packetCallback);
        signal?.addEventListener("abort", () => {
            packetCallbacks = packetCallbacks.filter((v) => v !== packetCallback);
        });
    };

    const sendPacket: WsConnection["sendPacket"] = (destination, body) => {
        if (!ws) throw new Error("WebSocket not open");
        const packet = { destination, body } satisfies RequestPacket;
        const data = JSON.stringify(packet);
        ws.send(data);

        packetSentCallbacks.map(async (callback) => {
            try {
                callback(packet);
            } catch (e) {
                console.error(e);
            }
        });
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
    return { onPacket, onPacketSent, sendPacket, disconnect };
};

const waitForWebsocketConnection = (ws: WebSocket): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        ws.addEventListener("open", () => resolve());
        ws.addEventListener("error", () => reject());
    });
};
