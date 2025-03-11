import { z } from "zod";

import { BlockDetectionResponse } from "./actions/block";
import { EvalRequest, EvalResponse } from "./actions/eval";
import { HeartbeatRequest, HeartbeatResponse } from "./actions/heartbeat";
import { PositionResponse } from "./actions/position";
import { RestartRequest } from "./actions/restart";
import { RotationResponse } from "./actions/rotation";
import { ScanRequest, ScanResponse } from "./actions/scan";

export const RequestPacket = z.object({
    destination: z.union([z.literal("*"), z.number()]),
    body: z.lazy(() => RequestBody),
});
export type RequestPacket = z.infer<typeof RequestPacket>;

export const ResponsePacket = z.object({
    sender: z.number(),
    body: z.lazy(() => ResponseBody),
});
export type ResponsePacket = z.infer<typeof ResponsePacket>;

export const RequestBody = z.lazy(() =>
    z.union([HeartbeatRequest, EvalRequest, RestartRequest, ScanRequest]),
);
export type RequestBody = z.infer<typeof RequestBody>;

export const ResponseBody = z.lazy(() =>
    z.union([
        HeartbeatResponse,
        EvalResponse,
        BlockDetectionResponse,
        RotationResponse,
        PositionResponse,
        ScanResponse,
    ]),
);
export type ResponseBody = z.infer<typeof ResponseBody>;

export type SenderType = number;
export type RequestPacketType = RequestBody["type"];
export type ResponsePacketType = ResponseBody["type"];
export type ResponseBodyFromType<TType extends ResponsePacketType> = Extract<
    ResponseBody,
    { type: TType }
>;
export type RequestBodyFromType<TType extends RequestPacketType> = Extract<
    RequestBody,
    { type: TType }
>;
export type ResponsePacketFromType<TType extends ResponsePacketType> = Extract<
    ResponsePacket,
    { body: { type: TType } }
>;
export type RequestPacketFromType<TType extends RequestPacketType> = Extract<
    RequestPacket,
    { body: { type: TType } }
>;
