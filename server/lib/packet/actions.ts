import { WsConnection } from "../ws/connection";
import {
    RequestBodyFromType,
    RequestPacketType,
    ResponseBodyFromType,
    ResponsePacketType,
} from "./packet";

const createRequestResponsePair = <
    TReqType extends RequestPacketType,
    TResType extends ResponsePacketType,
>(
    requestType: TReqType,
    responseType: TResType,
): ((
    conn: WsConnection,
    computerId: number,
    request: Omit<RequestBodyFromType<TReqType>, "type">,
) => Promise<[ResponseBodyFromType<TResType>, number]>) => {
    return async (
        conn: WsConnection,
        computerId: number,
        request: Omit<RequestBodyFromType<TReqType>, "type">,
    ) => {
        conn.sendPacket(computerId, { type: requestType, ...request } as any);
        const body = await conn.waitForPacket(responseType);
        return [body, computerId];
    };
};

export const sendHeartbeat = createRequestResponsePair("request:heartbeat", "response:heartbeat");
export const sendEval = createRequestResponsePair("request:eval", "response:eval");
