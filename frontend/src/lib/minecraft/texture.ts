import { AtlasParser } from "mc-assets";
import blocksAtlases from "mc-assets/dist/blocksAtlases.json";
import blocksAtlasLatest from "mc-assets/dist/blocksAtlasLatest.png";
import blocksAtlasLegacy from "mc-assets/dist/blocksAtlasLegacy.png";
import itemAtlasData from "mc-assets/dist/itemsAtlases.json";
import itemsAtlas from "mc-assets/dist/itemsAtlasLatest.png";

const itemAtlas = new AtlasParser(itemAtlasData, itemsAtlas);
const blockAtlas = new AtlasParser(blocksAtlases, blocksAtlasLatest, blocksAtlasLegacy); // blocksAtlasLegacy is optional

export const UNKNOWN_SLOT = { name: "", count: 0 };
export type ItemInfo = {
    name: string;
    count: number;
};
export type ItemSlot = ItemInfo | null;

export const ITEM_NAMES = Array.from(Object.keys(itemAtlas.atlas.latest.textures));

let itemCache = new Map<string, string>();
export const getItemTexture = async (name: string): Promise<string | null> => {
    const PREFIX = "minecraft:";
    if (name.startsWith(PREFIX)) name = name.slice(PREFIX.length);

    if (itemCache.has(name)) return itemCache.get(name)!;

    const item = itemAtlas.getTextureInfo(name) ?? blockAtlas.getTextureInfo(name);
    if (!item) return null;

    const img = await item.getLoadedImage();
    const url = generateImageTexture(img, item);

    itemCache.set(name, url);
    return url;
};

let blockCache = new Map<string, string>();
export const getCachedBlockTexture = (name: string): string | undefined => {
    const PREFIX = "minecraft:";
    if (name.startsWith(PREFIX)) name = name.slice(PREFIX.length);

    return blockCache.get(name);
};

export const getBlockTexture = async (name: string): Promise<string | undefined> => {
    const PREFIX = "minecraft:";
    if (name.startsWith(PREFIX)) name = name.slice(PREFIX.length);

    const BLOCK_PREFIX = "block/";
    if (name.startsWith(BLOCK_PREFIX)) name = name.slice(BLOCK_PREFIX.length);

    name = blockTextureMap[name] ?? name;
    if (blockCache.has(name)) return blockCache.get(name)!;

    const item = blockAtlas.getTextureInfo(name) ?? itemAtlas.getTextureInfo(name);
    if (!item) return undefined;

    const img = await item.getLoadedImage();
    const url = generateImageTexture(img, item);
    blockCache.set(name, url);
    return url;
};

const generateImageTexture = (
    img: HTMLImageElement,
    { u, v, su, sv }: { u: number; v: number; su: number; sv: number },
): string => {
    const sourceWidthSize = img.width * su; // 16
    const sourceHeightSize = img.width * sv; // 16

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        img,
        u * img.width,
        v * img.height,
        sourceWidthSize,
        sourceHeightSize,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    return canvas.toDataURL();
};

const blockTextureMap: Record<string, string | undefined> = {
    grass_block: "grass_block_top",
    dirt_path: "grass_path_top",
    wall_torch: "torch",
    glass_pane: "glass",

    cobblestone_stairs: "cobblestone",
    cobblestone_wall: "cobblestone",
    cobblestone_slab: "cobblestone",

    stripped_oak_wood: "stripped_oak_log",
    oak_fence: "oak_planks",
    oak_stairs: "oak_planks",
    oak_slab: "oak_planks",

    wheat: "wheat_stage_7",
    carrots: "carrots_stage3",
    tall_grass: "tall_grass_bottom",
    oak_door: "oak_door_top",
    iron_door: "iron_door_top",

    white_bed: "white_wool",
};
