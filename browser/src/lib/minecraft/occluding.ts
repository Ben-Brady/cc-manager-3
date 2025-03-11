import { isFlower } from "@/components/extensive/Canvas/Block/FlowerMesh";
import { isLiquid } from "@/components/extensive/Canvas/Block/LiquidMesh";

const cache = new Map<string, boolean>();
export const isBlockOccluding = (name: string): boolean => {
    const cached = cache.get(name);
    if (cached !== undefined) return cached;

    const value = (() => {
        if (name === "minecraft:air") return false;
        if (name.includes("turtle")) return false;
        if (isLiquid(name)) return false;
        if (isFlower(name)) return false;
        return true;
    })();

    return value;
};
