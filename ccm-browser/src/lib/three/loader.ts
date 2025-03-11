import * as THREE from "three";

import MissingImage from "@/assets/images/missing.png?url";

const loader = new THREE.TextureLoader();

export const loadTexture = (url: string): THREE.Texture => {
    const texture = loader.load(url);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Pixelate
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return texture;
};

export const MISSING_TEXTURE = loadTexture(MissingImage);
