import { useEffect, useState } from "react";

import { getBlockTexture } from "@/lib/minecraft/texture";
import * as THREE from "three";
import { loadTexture } from "@/lib/three/loader";

export const LOADING = Symbol();
type Loading = typeof LOADING;

type TextureResult = THREE.Texture | undefined | Loading;

const cache = new Map<string, THREE.Texture>();

export const useBlockTexture = (name: string): TextureResult => {
    name = rewriteName(name);
    const [texture, setTexture] = useState<TextureResult>(() => cache.get(name) ?? LOADING);

    useEffect(() => {
        if (texture !== LOADING) return;

        (async () => {
            const url = await getBlockTexture(name);
            if (!url) {
                setTexture(undefined);
            } else {
                setTexture(loadTexture(url));
            }
        })();
    }, [name, texture]);

    return texture;
};

const rewrites = {
    "minecraft:wall_torch": "minecraft:torch",
} as any;

const rewriteName = (name: string): string => {
    return rewrites[name] ?? name;
};
