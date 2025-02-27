import { z } from "zod";

export const DeviceType = z.enum(["computer", "turtle", "pocket"]);
export type DeviceType = z.infer<typeof DeviceType>;

export const LockType = z.enum(["inventory", "movement"]);
export type LockType = z.infer<typeof LockType>;

export const Item = z.object({
    name: z.string(),
    count: z.number(),
});
export type Item = z.infer<typeof Item>;

export const ItemSlot = Item.nullable();
export type ItemSlot = z.infer<typeof ItemSlot>;

export const Vector = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});
export type Vector = z.infer<typeof Vector>;

export const Rotation = z.enum(["east", "west", "north", "south"]);
export type Rotation = z.infer<typeof Rotation>;
