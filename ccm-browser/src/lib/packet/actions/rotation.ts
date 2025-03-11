import { z } from "zod";

import { Rotation } from "../generic";

export const RotationResponse = z.object({
    type: z.literal("update:rotation"),
    facing: Rotation,
});
export type RotationResponse = z.infer<typeof RotationResponse>;
