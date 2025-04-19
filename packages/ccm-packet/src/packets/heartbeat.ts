import { z } from "zod";

import { ItemSlot } from "../index.js";
import { HandSlot, LockType, Vec3 } from "../generic.js";
import { luaArray } from "../utils.js";

export const HeartbeatRequest = z.object({
    type: z.literal("request:heartbeat"),
});
export type HeartbeatRequest = z.infer<typeof HeartbeatRequest>;

export const HeartbeatResponse = z.object({
    type: z.literal("response:heartbeat"),
    label: z.string().optional(),
    uptime: z.number(),
    position: z.lazy(() => Vec3).optional(),
    deviceData: z.discriminatedUnion("type", [
        z.object({ type: z.literal("computer") }),
        z.object({
            type: z.literal("turtle"),
            inventory: ItemSlot.array(),
            selectedSlot: z.number(),
            leftHand: HandSlot.optional(),
            rightHand: HandSlot.optional(),
            fuel: z.number(),
        }),
        z.object({ type: z.literal("pocket") }),
    ]),

    locks: luaArray(LockType),
});
export type HeartbeatResponse = z.infer<typeof HeartbeatResponse>;
