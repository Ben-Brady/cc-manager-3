import { z } from "zod";

import { Item } from "../generic";

export const InventoryResponse = z.object({
    type: z.literal("update:inventory"),
    inventory: z.record(z.number(), Item),
});
export type InventoryResponse = z.infer<typeof InventoryResponse>;
