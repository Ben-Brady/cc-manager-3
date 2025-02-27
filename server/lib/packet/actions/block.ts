import { z } from "zod";

export const BlockDetectionResponse = z.object({
    type: z.literal("response:block-detection"),
    block: z.string(),
    direction: z.enum(["up", "down", "front"]),
});
export type BlockDetectionResponse = z.infer<typeof BlockDetectionResponse>;
