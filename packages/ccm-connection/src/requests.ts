import {
    EvalResponse,
    HeartbeatResponse,
    LockType,
    ResponsePacket,
    ScanResponse,
} from "ccm-packet";
import { WsConnection } from "./ws";

export const requestScan = async (
    conn: WsConnection,
    deviceId: number,
    range: number,
): Promise<ScanResponse> => {
    conn.sendPacket(deviceId, { type: "request:scan", range });
    const packet = await waitForPacket<ScanResponse>(conn, deviceId, "response:scan");
    return packet.body;
};

export const requestHeartbeat = async (
    conn: WsConnection,
    deviceId: number,
): Promise<HeartbeatResponse> => {
    conn.sendPacket(deviceId, { type: "request:heartbeat" });
    const packet = await waitForPacket<HeartbeatResponse>(conn, deviceId, "response:heartbeat");
    return packet.body;
};

export const broadcastHeartbeatRequest = async (conn: WsConnection) => {
    conn.sendPacket("*", { type: "request:heartbeat" });
};

export const requestRestart = async (conn: WsConnection, deviceId: number): Promise<void> => {
    conn.sendPacket(deviceId, { type: "request:restart" });
};

export type EvalResult = {
    isError: boolean;
    value: any | undefined;
};

export type EvalOptions = {
    deviceId: number;
    code: string;
    locks?: LockType[];
    timeout?: number;
};

const sleep = (ms: number) =>
    new Promise<undefined>((resolve) => {
        setTimeout(() => resolve(undefined), ms);
    });

const randomHex = (length: number) =>
    Array.from({ length })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

export const requestEval = async (
    conn: WsConnection,
    { deviceId, code, locks = [], timeout = Infinity }: EvalOptions,
): Promise<EvalResult> => {
    const id = randomHex(8);

    conn.sendPacket(deviceId, { type: "request:eval", id, code, locks });
    const result = await Promise.race([waitForEvalResponse(conn, deviceId, id), sleep(timeout)]);

    if (!result) {
        return {
            isError: true,
            value: `Request ${id}: Timeout\n${code}`,
        };
    }
    const { isError, value } = result;

    if (isError) {
        return { isError: true, value: value };
    }

    try {
        return {
            isError: false,
            value: JSON.parse(value ?? ""),
        };
    } catch {
        return {
            isError: false,
            value: undefined,
        };
    }
};

export const waitForPacket = async <T extends ResponsePacket["body"]>(
    conn: WsConnection,
    deviceId: number,
    type: T["type"],
): Promise<{ sender: number; body: T }> => {
    return await new Promise((resolve) => {
        const controller = new AbortController();
        conn.onPacket((packet) => {
            if (packet.sender !== deviceId) return;
            if (packet.body.type !== type) return;

            resolve(packet as { sender: number; body: T });

            controller.abort();
        }, controller.signal);
    });
};

const waitForEvalResponse = (conn: WsConnection, deviceId: number, id: string) =>
    new Promise<EvalResponse>((resolve) => {
        const controller = new AbortController();
        conn.onPacket((packet) => {
            if (packet.sender !== deviceId) return;
            if (packet.body.type !== "response:eval") return;
            if (packet.body.id !== id) return;

            resolve(packet.body);

            controller.abort();
        }, controller.signal);
    });
