import { z } from "zod";

import { Vec3 } from "../generic";

export const ScanRequest = z.object({
    type: z.literal("request:scan"),
    range: z.number(),
});
export type ScanRequest = z.infer<typeof ScanRequest>;

export const ScanResponse = z.object({
    type: z.literal("response:scan"),
    blocks: z
        .object({
            block: z.string(),
            position: Vec3,
        })
        .array(),
});
export type ScanResponse = z.infer<typeof ScanResponse>;
