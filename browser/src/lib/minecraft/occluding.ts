import { getModel } from "./model";

const cache = new Map<string, boolean>();
export const isBlockOccluding = (name: string): boolean => {
    const cached = cache.get(name);
    if (cached !== undefined) return cached;
    const model = getModel(name, {});
    if (!model) return false;

    const element = model?.elements?.[0];
    if (!element) return false;

    const isFullBlock = element.from.every((v) => v === 0) && element.to.every((v) => v === 16);
    cache.set(name, isFullBlock);
    return isFullBlock;
};
