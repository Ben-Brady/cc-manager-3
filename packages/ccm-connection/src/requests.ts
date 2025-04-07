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
    return await waitForPacket(conn, deviceId, "response:eval");
};

const waitForPacket = <T extends ResponsePacketType>(
    conn: WsConnection,
    deviceId: number,
    type: T,
): Promise<ResponsePacketFromType<T>> => {
    return new Promise<ResponsePacketFromType<T>>((resolve) => {
        const controller = new AbortController();
        conn.onPacket((packet) => {
            if (packet.sender !== deviceId) return;
            if (packet.body.type !== type) return;

            resolve(packet as ResponsePacketFromType<T>);
            controller.abort();
        }, controller.signal);
    });
};
