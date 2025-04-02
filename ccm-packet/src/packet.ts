import { z } from "zod";

import { BlockDetectionResponse } from "./packets/block.js";
import { EvalRequest, EvalResponse } from "./packets/eval.js";
import { HeartbeatRequest, HeartbeatResponse } from "./packets/heartbeat.js";
import { PositionUpdate } from "./packets/position.js";
import { RestartRequest } from "./packets/restart.js";
import { RotationUpdate } from "./packets/rotation.js";
import { ScanRequest, ScanResponse } from "./packets/scan.js";

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
        RotationUpdate,
        PositionUpdate,
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
