import { z } from "zod";

import { LockType } from "../generic";

export const EvalRequest = z.object({
    type: z.literal("request:eval"),
    code: z.string(),
    locks: LockType.array(),
});
export type EvalRequest = z.infer<typeof EvalRequest>;

export const EvalResponse = z.object({
    type: z.literal("response:eval"),
    isError: z.boolean(),
    value: z.string(),
});
export type EvalResponse = z.infer<typeof EvalResponse>;
