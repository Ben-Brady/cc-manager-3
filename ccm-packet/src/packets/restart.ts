import { z } from "zod";

export const RestartRequest = z.object({
    type: z.literal("request:restart"),
});
export type RestartRequest = z.infer<typeof RestartRequest>;
