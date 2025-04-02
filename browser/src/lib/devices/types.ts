import { DeviceType, ItemSlot, LockType, Rotation, Vec3 } from "ccm-packet";

type BaseComputer = {
    id: number;
    label?: string;
    type: DeviceType;
    uptime: number;
    lastUpdated: number;
    position?: Vec3;
    locks: LockType[];
};

export type TurtleInfo = BaseComputer & {
    inventory?: ItemSlot[];
    selectedSlot?: number;
    facing?: Rotation;
    leftHand?: ItemSlot;
    rightHand?: ItemSlot;
    fuel?: number;
};

export type ComputerInfo =
    | ({
          type: "computer" | "pocket";
      } & BaseComputer)
    | TurtleInfo;
