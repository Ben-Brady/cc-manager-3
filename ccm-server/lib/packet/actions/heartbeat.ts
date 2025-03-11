import { z } from "zod";

import { ItemSlot } from "..";
import { Item, LockType, Vec3 } from "../generic";
import { luaArray } from "../utils";

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
            inventory: z.record(z.number(), Item),
            selectedSlot: z.number(),
            leftHand: ItemSlot.optional(),
            rightHand: ItemSlot.optional(),
            fuel: z.number(),
        }),
        z.object({ type: z.literal("pocket") }),
    ]),

    locks: luaArray(LockType),
});
export type HeartbeatResponse = z.infer<typeof HeartbeatResponse>;
