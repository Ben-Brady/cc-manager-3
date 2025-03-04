import { AtlasParser } from "mc-assets";
import { AssetsParser, getLoadedBlockstatesStore, getLoadedModelsStore } from "mc-assets";
import blocksAtlases from "mc-assets/dist/blocksAtlases.json";
import blocksAtlasLatest from "mc-assets/dist/blocksAtlasLatest.png";
import blockstatesModels from "mc-assets/dist/blockStatesModels.json";

const blockAtlas = new AtlasParser(blocksAtlases, blocksAtlasLatest);

const blockstatesStore = getLoadedBlockstatesStore(blockstatesModels);
const modelsStore = getLoadedModelsStore(blockstatesModels);
const modelAssets = new AssetsParser("latest", blockstatesStore, modelsStore);

const MINECRAFT_PREFIX = "minecraft:";
const removeNamespace = (name: string) =>
    name.startsWith(MINECRAFT_PREFIX) ? name.slice(MINECRAFT_PREFIX.length) : name;

const getModel = (name: string) => {
    const models = modelAssets.getAllResolvedModels(
        {
            name: "poppy", // block name not model name
            properties: { axis: "x" },
        },
        false,
    ); // false (default) means return empty if variant matching properties is not found

    const primaryModel = models?.[0];
    const faces = primaryModel?.[0]?.elements?.[0];
    console.log(faces);
};

const getFallbackModel = (name: string) => {
    name = removeNamespace(name);
    const fallbackModel = blockstatesStore.get("latest", name).variants[""];
    console.log(fallbackModel);
};
getModel("oak_log");
