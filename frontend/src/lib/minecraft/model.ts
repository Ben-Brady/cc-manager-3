import { AssetsParser, getLoadedBlockstatesStore, getLoadedModelsStore } from "mc-assets";
import blockstatesModels from "mc-assets/dist/blockStatesModels.json";

import { THREE } from "../three";
import { MISSING_TEXTURE } from "../three/loader";
import { removeNamespace } from "./utils";

const blockstatesStore = getLoadedBlockstatesStore(blockstatesModels as any);
const modelsStore = getLoadedModelsStore(blockstatesModels as any);
const modelAssets = new AssetsParser("latest", blockstatesStore, modelsStore);

export type Face = {
    origin: THREE.Vector3;
    size: THREE.Vector2;
    rotation: THREE.Euler;
    texture: string;
    side: THREE.Side;
};

export const getModelFaces = (
    name: string,
    properties: Record<string, string>,
): Face[] | undefined => {
    name = removeNamespace(name);
    const model = getModel(name, properties);
    const elements = model?.elements;
    if (!elements) return undefined;
    const faces: Face[] = [];

    for (const element of elements) {
        const baseOffset = new THREE.Vector3(0.5, 0.5, 0.5);
        const from = new THREE.Vector3(...element.from).divideScalar(16).add(baseOffset.clone());
        const to = new THREE.Vector3(...element.to).divideScalar(16).add(baseOffset.clone());

        const elementFaces = Object.values(element.faces)
            .map((face): Face | undefined => {
                let texture = face.texture ?? MISSING_TEXTURE;
                let side: THREE.Side = THREE.FrontSide;
                let size = new THREE.Vector2(1, 1);

                if (!face.cullface) return undefined;
                const { rotation, offset } = faceThings[face.cullface as Size];
                const origin = offset.clone().add(from.clone()).add(baseOffset.clone());
                return { origin, rotation, size, side, texture };
            })
            .filter((v) => !!v);

        faces.push(...elementFaces);
    }

    return faces;
};

type ResolvedModelsReturn = ReturnType<typeof modelAssets.getResolvedModelFirst>;
type MCAssetsModel = ResolvedModelsReturn extends (infer T)[] | undefined ? T : never;

export const getModel = (
    name: string,
    properties: Record<string, string>,
): MCAssetsModel | undefined => {
    name = removeNamespace(name);
    const models = modelAssets.getAllResolvedModels({ name, properties }, true);
    const model = models?.[0]?.[0];
    return model;
};

type Size = "up" | "down" | "-z" | "+z" | "+x" | "-x";

const QUATER_TURN = Math.PI / 2;
const faceThings: Record<Size, { offset: THREE.Vector3; rotation: THREE.Euler }> = {
    up: {
        offset: new THREE.Vector3(0.5, 1, 0.5),
        rotation: new THREE.Euler(-QUATER_TURN, 0, QUATER_TURN * 2),
    },
    down: {
        offset: new THREE.Vector3(0.5, 0, 0.5),
        rotation: new THREE.Euler(QUATER_TURN, 0, QUATER_TURN * 2),
    },
    north: {
        offset: new THREE.Vector3(0.5, 0.5, 1),
        rotation: new THREE.Euler(0, 0, 0),
    },
    south: {
        offset: new THREE.Vector3(0.5, 0.5, 0),
        rotation: new THREE.Euler(QUATER_TURN * 2, 0, QUATER_TURN * 2),
    },
    east: {
        offset: new THREE.Vector3(1, 0.5, 0.5),
        rotation: new THREE.Euler(QUATER_TURN * 2, QUATER_TURN, QUATER_TURN * 2),
    },
    west: {
        offset: new THREE.Vector3(0, 0.5, 0.5),
        rotation: new THREE.Euler(QUATER_TURN * 2, QUATER_TURN * 3, QUATER_TURN * 2),
    },
};
