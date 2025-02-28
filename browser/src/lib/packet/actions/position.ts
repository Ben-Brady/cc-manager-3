import { z } from "zod";

import { Vec3 } from "../generic";

export const RotationResponse = z.object({
    type: z.literal("response:position"),
    position: Vec3,
});
export type RotationResponse = z.infer<typeof RotationResponse>;
