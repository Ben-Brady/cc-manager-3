import { AssetsParser, getLoadedBlockstatesStore, getLoadedModelsStore } from "mc-assets";
import blockstatesModels from "mc-assets/dist/blockStatesModels.json";

import { THREE } from "../three";
import { removeNamespace } from "./utils";

const blockstatesStore = getLoadedBlockstatesStore(blockstatesModels as any);
const modelsStore = getLoadedModelsStore(blockstatesModels as any);
const modelAssets = new AssetsParser("latest", blockstatesStore, modelsStore);

type Face = {
    origin: THREE.Vector3;
    size: THREE.Vector3;
    texture: THREE.Texture;
    side: THREE.Side;
};

export const getModel = (name: string, properties: Record<string, string>): Model[] | undefined => {
    name = removeNamespace(name);
    const fallbackModel = blockstatesStore.get("latest", name).variants[""];
    const models = modelAssets.getAllResolvedModels({ name, properties }, false); // false (default) means return empty if variant matching properties is not found

    const primaryModel = models?.[0];
    const faces = primaryModel?.[0]?.elements?.[0];
    console.log(faces);
    console.log(fallbackModel);
};
