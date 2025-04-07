import { z } from "zod";
import { DeviceType, ItemSlot, LockType, Rotation, Vec3 } from "./generic";

export type Computer = z.infer<typeof Computer>;
export const Computer = z.object({
    id: z.number(),
    type: DeviceType,
    uptime: z.number(),
    lastUpdated: z.number(),

    locks: LockType.array(),
    inventory: ItemSlot.array().optional(),
    selectedSlot: z.number().optional(),
    facing: Rotation.optional(),
    leftHand: ItemSlot.optional(),
    rightHand: ItemSlot.optional(),
    label: z.string().optional(),
    position: Vec3.optional(),
});

export type Block = z.infer<typeof Block>;
export const Block = z.object({
    name: z.string(),
    position: Vec3,
});

export type Chunk = z.infer<typeof Block>;
export const Chunk = z.object({
    blocks: z.number().array(),
    palette: z.string().array(),
});
