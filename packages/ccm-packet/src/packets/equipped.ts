import { z } from "zod";

import { HandSlot } from "../generic.js";

export const EquippedUpdate = z.object({
    type: z.literal("update:equipped"),
    side: z.enum(["right", "left"]),
    item: HandSlot,
});
export type EquippedUpdate = z.infer<typeof EquippedUpdate>;
