import { range } from "lodash";
import { useEffect, useMemo, useState } from "react";

import { ComputerInfo } from "@/lib/devices/types";
import { HeartbeatResponse, Vec3 } from "@/lib/packet";
import { WsConnection } from "@/lib/ws/connection";

export type Block = {
    position: Vec3;
    name: string;
};

const createVectorKey = (vec: Vec3) => `${vec.x}, ${vec.y}, ${vec.z}`;

export const useComputerInfo = (conn: WsConnection) => {
    const [computers, setComputers] = useState<Record<number, ComputerInfo>>({});
    const [blocks, setBlocks] = useState<Record<number, Block>>({});

    useEffect(() => {
        (async () => {
            const r = await fetch("http://localhost:8000/api/memory");
            const { devices, blocks } = await r.json();
            setComputers(devices);
            setBlocks(blocks);
        })();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        conn.listenFor("response:block-detection", signal, ({ direction, block }, sender) => {
            const turtle = computers[sender];
            if (turtle?.type !== "turtle") return;
            if (!turtle.position) return;

            // We need to know the rotation in order to detect blocks in front
            if (direction === "front" && !turtle.facing) return;

            const blockPos = (() => {
                const pos = turtle.position;
                if (direction === "up") return { ...pos, y: pos.y + 1 };
                if (direction === "down") return { ...pos, y: pos.y - 1 };

                if (turtle.facing === "north") return { ...pos, z: pos.z + 1 };
                if (turtle.facing === "south") return { ...pos, z: pos.z - 1 };
                if (turtle.facing === "east") return { ...pos, x: pos.x + 1 };
                if (turtle.facing === "west") return { ...pos, x: pos.x - 1 };
            })();

            const key = createVectorKey(blockPos);
            setBlocks((blocks) => ({
                ...blocks,
                [key]: {
                    position: blockPos,
                    name: block,
                },
            }));
        });

        conn.listenFor("response:rotation", signal, (body, sender) => {
            setComputers((computers) => {
                const device = computers[sender];
                if (!device) return computers;
                return { ...computers, [sender]: { ...device, facing: body.facing } };
            });
        });

        conn.listenFor("response:heartbeat", signal, (body, sender) => {
            setComputers((computers) => {
                let computer = computers[sender];
                if (!computer) computer = generateInitialDevice(body, sender);
                const newComputer = applyHeartbeat(computer, body);

                return {
                    ...computers,
                    [sender]: newComputer,
                };
            });
        });

        return () => controller.abort();
    }, [conn]);

    const computerList = useMemo(() => Object.values(computers), [computers]);
    return { computers: computerList };
};

const generateInitialDevice = (heartbeat: HeartbeatResponse, sender: number): ComputerInfo => {
    return {
        id: sender,
        lastUpdated: Date.now(),
        uptime: Math.floor(heartbeat.uptime),
        type: heartbeat.deviceData.type,
        locks: [],
    };
};

const applyHeartbeat = (computer: ComputerInfo, body: HeartbeatResponse): ComputerInfo => {
    if (computer.type !== "turtle") {
        return {
            ...computer,
            type: computer.type,
            label: body.label,
            lastUpdated: Date.now(),
            position: computer.position ?? body.position,
            uptime: Math.floor(body.uptime),
            locks: body.locks,
        };
    }

    const inventory =
        body.deviceData.type === "turtle"
            ? range(16).map((i) => body.deviceData.inventory[i])
            : undefined;
    const selectedSlot =
        body.deviceData.type === "turtle" ? body.deviceData.selectedSlot : undefined;

    return {
        ...computer,
        label: body.label,
        lastUpdated: Date.now(),
        uptime: Math.floor(body.uptime),
        type: body.deviceData.type,
        position: body.position ?? computer.position,
        inventory: inventory ?? computer.inventory,
        selectedSlot: selectedSlot ?? computer.selectedSlot,
        locks: body.locks ?? computer.locks,
    };
};
