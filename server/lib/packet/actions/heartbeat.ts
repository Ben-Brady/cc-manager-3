import { z } from "zod";

import { Item, LockType, Vector } from "../generic";
import { luaArray } from "../utils";
import { ItemSlot } from "..";

export const HeartbeatRequest = z.object({
    type: z.literal("request:heartbeat"),
});
export type HeartbeatRequest = z.infer<typeof HeartbeatRequest>;

export const HeartbeatResponse = z.object({
    type: z.literal("response:heartbeat"),
    label: z.string().optional(),
    uptime: z.number(),
    position: z.lazy(() => Vector).optional(),
    deviceData: z.discriminatedUnion("type", [
        z.object({ type: z.literal("computer") }),
        z.object({
            type: z.literal("turtle"),
            inventory: z.record(z.number(), Item),
            selectedSlot: z.number(),
            leftHand: ItemSlot.optional(),
            rightHand: ItemSlot.optional(),
        }),
        z.object({ type: z.literal("pocket") }),
    ]),

    locks: luaArray(LockType),
});
export type HeartbeatResponse = z.infer<typeof HeartbeatResponse>;
