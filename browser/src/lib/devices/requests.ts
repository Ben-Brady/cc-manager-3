import {
    RequestBodyFromType,
    RequestPacketType,
    ResponseBodyFromType,
    ResponsePacketType,
} from "../packet/packet";
import { WsConnection } from "../ws/connection";

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
) => Promise<ResponseBodyFromType<TResType>>) => {
    return async (
        conn: WsConnection,
        computerId: number,
        request: Omit<RequestBodyFromType<TReqType>, "type">,
    ) => {
        conn.sendPacket(computerId, { type: requestType, ...request } as any);
        const body = await conn.waitForPacket(responseType);
        return body;
    };
};

export const sendHeartbeat = createRequestResponsePair("request:heartbeat", "response:heartbeat");
export const sendEval = createRequestResponsePair("request:eval", "response:eval");
export const sendRotationRequest = createRequestResponsePair(
    "request:rotation",
    "response:rotation",
);
