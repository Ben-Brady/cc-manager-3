import { z } from "zod";

import { BlockDetectionResponse } from "./actions/block";
import { EvalRequest, EvalResponse } from "./actions/eval";
import { HeartbeatRequest, HeartbeatResponse } from "./actions/heartbeat";
import { RestartRequest } from "./actions/restart";
import { RotationRequest, RotationResponse } from "./actions/rotation";

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
    z.union([HeartbeatRequest, EvalRequest, RestartRequest, RotationRequest]),
);
export type RequestBody = z.infer<typeof RequestBody>;

export const ResponseBody = z.lazy(() =>
    z.union([HeartbeatResponse, EvalResponse, BlockDetectionResponse, RotationResponse]),
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
