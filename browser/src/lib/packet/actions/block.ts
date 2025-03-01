import { z } from "zod";
import { Vec3 } from "../generic";

export const BlockDetectionResponse = z.object({
    type: z.literal("response:block-detection"),
    block: z.string(),
    position: Vec3,
});
export type BlockDetectionResponse = z.infer<typeof BlockDetectionResponse>;
