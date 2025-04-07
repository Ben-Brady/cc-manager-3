import { z } from "zod";

import { Rotation } from "../generic.js";

export const RotationUpdate = z.object({
    type: z.literal("update:rotation"),
    facing: Rotation,
});
export type RotationUpdate = z.infer<typeof RotationUpdate>;
