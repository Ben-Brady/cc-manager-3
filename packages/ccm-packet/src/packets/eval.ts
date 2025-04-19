import { z } from "zod";

import { LockType } from "../generic.js";

export const EvalRequest = z.object({
    type: z.literal("request:eval"),
    id: z.string(),
    code: z.string(),
    locks: LockType.array(),
});
export type EvalRequest = z.infer<typeof EvalRequest>;

export const EvalResponse = z.object({
    type: z.literal("response:eval"),
    id: z.string(),
    isError: z.boolean(),
    value: z.string().optional(),
});
export type EvalResponse = z.infer<typeof EvalResponse>;
