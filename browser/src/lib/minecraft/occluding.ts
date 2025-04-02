import { isFlower } from "@/components/extensive/Canvas/Block/FlowerMesh";
import { hasTransparency } from "@/components/extensive/Canvas/Block/FullBlockMesh";
import { isLiquid } from "@/components/extensive/Canvas/Block/LiquidMesh";

export const isBlockOccluding = (name: string): boolean => {
    if (name === "minecraft:air") return false;
    if (name.includes("turtle")) return false;
    if (isLiquid(name)) return false;
    if (isFlower(name)) return false;
    if (hasTransparency(name)) return false;
    return true;
};
