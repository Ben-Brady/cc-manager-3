import { z } from "zod";

import { ItemSlot } from "../generic.js";

export const InventoryUpdate = z.object({
    type: z.literal("update:inventory"),
    inventory: ItemSlot.array(),
});
export type InventoryUpdate = z.infer<typeof InventoryUpdate>;

export const SelectionResponse = z.object({
    type: z.literal("update:selection"),
    slot: z.number(),
});
export type SelectionResponse = z.infer<typeof SelectionResponse>;
