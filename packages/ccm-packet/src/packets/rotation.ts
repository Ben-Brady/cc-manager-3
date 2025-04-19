import { z } from "zod";

import { Direction } from "../generic.js";

export const RotationUpdate = z.object({
    type: z.literal("update:rotation"),
    facing: Direction,
});
export type RotationUpdate = z.infer<typeof RotationUpdate>;
