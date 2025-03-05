import { THREE } from ".";

export const toVector3 = <T extends { x: number; y: number; z: number }>({
    x,
    y,
    z,
}: T): THREE.Vector3 => {
    return new THREE.Vector3(x, y, z);
};
