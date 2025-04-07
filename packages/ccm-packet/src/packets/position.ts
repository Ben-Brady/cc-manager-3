import { z } from "zod";

import { Vec3 } from "../generic.js";

export const PositionUpdate = z.object({
    type: z.literal("update:position"),
    position: Vec3,
});
export type PositionUpdate = z.infer<typeof PositionUpdate>;
