import { Vec3 } from "../packet";
import { THREE } from ".";

type GenericVec3 = { x: number; y: number; z: number };

export const toVector3 = ({ x, y, z }: GenericVec3): THREE.Vector3 => new THREE.Vector3(x, y, z);
export const toVec3Array = ({ x, y, z }: GenericVec3) => [x, y, z] as [number, number, number];

export const toStringVec3 = (pos: Vec3) => `${pos.x},${pos.y},${pos.z}`;
