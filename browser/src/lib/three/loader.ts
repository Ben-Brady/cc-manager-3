import * as THREE from "three";

const loader = new THREE.TextureLoader();

export const loadTexture = (url: string): THREE.texture => {
    const texture = loader.load(url);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Pixelate
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return texture;
};
