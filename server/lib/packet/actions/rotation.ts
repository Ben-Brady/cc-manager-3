import { z } from "zod";

import { Rotation } from "../generic";

export const RotationRequest = z.object({
    type: z.literal("request:rotation"),
});
export type RotationRequest = z.infer<typeof RotationRequest>;

export const RotationResponse = z.object({
    type: z.literal("response:rotation"),
    facing: Rotation,
});
export type RotationResponse = z.infer<typeof RotationResponse>;
