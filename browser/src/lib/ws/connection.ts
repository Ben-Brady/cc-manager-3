import { RequestBody, ResponseBodyFromType, ResponsePacketType } from "../packet";
import {
    addPacketListener,
    broadcastPacket,
    sendPacket,
    waitForPacket,
    waitForWebsocketConnection,
} from "./utils";

export type WaitForPacketFunc = <T extends ResponsePacketType>(
    type: T,
) => Promise<ResponseBodyFromType<T>>;
export type OnPacketFunc = <T extends ResponsePacketType>(
    type: T,
    signal: AbortSignal,
    callback: (packet: ResponseBodyFromType<T>, sender: number) => void,
) => void;

export type WsConnection = {
    waitForPacket: WaitForPacketFunc;
    listenFor: OnPacketFunc;
    sendPacket: (computerId: number, packet: RequestBody) => void;
    broadcastPacket: (packet: RequestBody) => void;
    close: () => void;
};

const HOSTNAME = "ws://12:3000";

export const playerJoinUrl = (code: string) => `${HOSTNAME}/join?code=${code}`;
export const playerRejoinUrl = (code: string, id: number) =>
    `${HOSTNAME}/join?code=${code}&id=${id}`;
export const hostUrl = () => `${HOSTNAME}/host`;
export const hostRejoinUrl = (code: string) => `${HOSTNAME}/host?code=${code}`;

type PacketCallback = {
    type: ResponsePacketType;
    callback: (packet: ResponsePacketType, sender: number) => void;
};

export const connectToProxy = async (url: string): Promise<WsConnection> => {
    const controller = new AbortController();
    const signal = controller.signal;
    let ws = new WebSocket(url);
    await waitForWebsocketConnection(ws);
    let packetCallbacks: PacketCallback[] = [];

    let reconnectUrl: string | undefined;
    ws.addEventListener(
        "close",
        () => {
            if (!reconnectUrl) return;
            ws = new WebSocket(reconnectUrl);
        },
        { signal: signal },
    );

    addPacketListener(ws, {
        callback: (packet, sender) => {
            console.log(packet);
            packetCallbacks.forEach(({ callback, type }) => {
                if (packet.type !== type) return;
                callback(packet as any, sender);
            });
        },
        signal: controller.signal,
    });

    const close: WsConnection["close"] = () => {
        controller.abort();
        ws.close();
    };

    const listenFor: WsConnection["listenFor"] = (type, signal, callback) => {
        const packetCallback: PacketCallback = { callback: callback as any, type };
        packetCallbacks.push(packetCallback);
        signal.addEventListener("abort", () => {
            packetCallbacks = packetCallbacks.filter((v) => v !== packetCallback);
        });
    };

    return {
        close,
        listenFor,
        broadcastPacket: (body) => broadcastPacket(ws, body),
        sendPacket: (clientId, body) => sendPacket(ws, clientId, body),
        waitForPacket: (type) => waitForPacket(ws, type, controller.signal),
    };
};
