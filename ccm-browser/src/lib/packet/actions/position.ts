import { z } from "zod";

import { Vec3 } from "../generic";

export const PositionResponse = z.object({
    type: z.literal("update:position"),
    position: Vec3,
});
export type PositionResponse = z.infer<typeof PositionResponse>;
