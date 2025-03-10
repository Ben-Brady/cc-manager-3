import { isFlower } from "@/components/extensive/canvas/Block/FlowerMesh";
import { isLiquid } from "@/components/extensive/canvas/Block/LiquidMesh";

const cache = new Map<string, boolean>();
export const isBlockOccluding = (name: string): boolean => {
    const cached = cache.get(name);
    if (cached !== undefined) return cached;

    const value = (() => {
        if (name !== "minecraft:air") return false;
        if (isLiquid(name)) return false;
        if (isFlower(name)) return false;
        if (name.includes("turtle")) return false;
        return true;
    })();
    cache.set(name, value);
    return value;
};
