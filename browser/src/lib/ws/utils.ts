import {
    RequestBody,
    RequestPacket,
    ResponseBody,
    ResponseBodyFromType,
    ResponsePacketType,
} from "../packet";

export const addPacketListener = (
    ws: WebSocket,
    options: {
        callback: (packet: ResponseBody, sender: number) => void;
    } & AddEventListenerOptions,
) => {
    const { callback, ...settings } = options;
    ws.addEventListener(
        "message",
        (e) => {
            const rawData = JSON.parse(e.data);
            const { body, sender } = rawData;

            callback(body, sender);
        },
        settings,
    );
};

export const addSpecificPacketListener = <TType extends ResponsePacketType>(
    ws: WebSocket,
    options: {
        callback: (packet: ResponseBodyFromType<TType>, sender: number) => void;
        packetType: TType;
    } & AddEventListenerOptions,
) => {
    const { callback, packetType, ...settings } = options;

    addPacketListener(ws, {
        callback: (packet, sender) => {
            if (packet.type !== packetType) return;
            callback(packet as any, sender);
        },
        ...settings,
    });
};

export const broadcastPacket = (ws: WebSocket, body: RequestBody) => {
    const data = { destination: "*", body } satisfies RequestPacket;
    const packet = JSON.stringify(data);
    ws.send(packet);
};

export const sendPacket = (ws: WebSocket, clientId: number, body: RequestBody) => {
    const data = { destination: clientId, body } satisfies RequestPacket;
    const packet = JSON.stringify(data);
    ws.send(packet);
};

export const waitForPacket = async <TType extends ResponsePacketType>(
    ws: WebSocket,
    type: TType,
    signal: AbortSignal | undefined = undefined,
): Promise<ResponseBodyFromType<TType>> => {
    const controller = new AbortController();
    if (signal) {
        signal = AbortSignal.any([controller.signal, signal]);
    } else {
        signal = controller.signal;
    }

    const packet = await new Promise<ResponseBodyFromType<TType>>((resolve) => {
        addSpecificPacketListener(ws, {
            packetType: type,
            signal: signal,
            callback: (packet) => {
                resolve(packet);
            },
        });
    });

    controller.abort();
    return packet;
};

export const waitForWebsocketConnection = (ws: WebSocket): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        ws.addEventListener("open", () => resolve());
        ws.addEventListener("error", () => reject());
    });
};
