import { isFlower } from "@/components/extensive/Canvas/Block/FlowerMesh";
import { isLiquid } from "@/components/extensive/Canvas/Block/LiquidMesh";

export const isBlockOccluding = (name: string): boolean => {
    if (name === "minecraft:air") return false;
    if (name.includes("turtle")) return false;
    if (isLiquid(name)) return false;
    if (isFlower(name)) return false;
    return true;
};
