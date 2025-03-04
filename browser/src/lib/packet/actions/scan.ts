import { z } from "zod";

export const ScanRequest = z.object({
    type: z.literal("request:scan"),
    range: z.number(),
});
export type ScanRequest = z.infer<typeof ScanRequest>;
