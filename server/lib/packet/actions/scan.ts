import { z } from "zod";

import { Vec3 } from "../generic";

export const ScanRequest = z.object({
    type: z.literal("request:scan"),
    range: z.number(),
});
export type ScanRequest = z.infer<typeof ScanRequest>;

export const ScanResponse = z.object({
    type: z.literal("response:scan"),
    position: Vec3.optional(),
    range: z.number(),
    blocks: z
        .object({
            name: z.string(),
            offset: Vec3,
        })
        .array(),
});
export type ScanResponse = z.infer<typeof ScanResponse>;
