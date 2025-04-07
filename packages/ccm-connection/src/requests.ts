import {
    EvalResponse,
    HeartbeatResponse,
    LockType,
    ResponsePacket,
    ResponsePacketFromType,
    ResponsePacketType,
    ScanResponse,
} from "ccm-packet";
import { WsConnection } from "./ws";

export const requestScan = async (
    conn: WsConnection,
    deviceId: number,
    range: number,
): Promise<ScanResponse> => {
    conn.sendPacket(deviceId, { type: "request:scan", range });
    const packet = await waitForPacket(conn, deviceId, "response:scan");
    return packet;
};

export const requestHeartbeat = async (
    conn: WsConnection,
    deviceId: number,
): Promise<HeartbeatResponse> => {
    conn.sendPacket(deviceId, { type: "request:heartbeat" });
    return await waitForPacket(conn, deviceId, "response:heartbeat");
};

export const broadcastHeartbeatRequest = async (conn: WsConnection) => {
    conn.sendPacket("*", { type: "request:heartbeat" });
};

export const requestRestart = async (conn: WsConnection, deviceId: number): Promise<void> => {
    conn.sendPacket(deviceId, { type: "request:restart" });
};

export const requestEval = async (
    conn: WsConnection,
    deviceId: number,
    code: string,
    locks: LockType[] = [],
): Promise<EvalResponse> => {
    conn.sendPacket(deviceId, { type: "request:eval", code, locks });
    return await waitForPacket(conn, deviceId, "response:heartbeat");
};

const waitForPacket = async <T extends ResponsePacketType>(
    conn: WsConnection,
    deviceId: number,
    type: T,
): Promise<ResponsePacketFromType<T>> => {
    const controller = new AbortController();

    const packet = await new Promise((resolve) => {
        const callback = (packet: ResponsePacket) => {
            if (packet.sender !== deviceId) return;
            if (packet.body.type !== type) return;
            resolve(packet);
        };
        conn.onPacket(callback, controller.signal);
    });

    controller.abort();
    return packet as ResponsePacketFromType<T>;
};
