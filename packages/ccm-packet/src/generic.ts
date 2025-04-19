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

export const HandSlot = z.enum([
    "empty",
    "unknown_item",
    "pickaxe",
    "axe",
    "shovel",
    "hoe",
    "sword",
    "crafting_table",
    "speaker",
    "ender_modem",
    "wireless_modem",
    "ap:geoscanner",
]);
export type HandSlot = z.infer<typeof HandSlot>;

export const ItemSlot = z.union([Item, z.literal("empty")]);
export type ItemSlot = z.infer<typeof ItemSlot>;

export const Direction = z.enum(["+x", "-x", "-z", "+z"]);
export type Direction = z.infer<typeof Direction>;

export type Vec3 = z.infer<typeof Vec3>;
export const Vec3 = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});

export const isEqualVec3 = (a: Vec3 | any, b: Vec3 | any) =>
    JSON.stringify(a) === JSON.stringify(b);
export const toStringVec3 = ({ x, y, z }: Vec3) => `${x},${y},${z}`;
