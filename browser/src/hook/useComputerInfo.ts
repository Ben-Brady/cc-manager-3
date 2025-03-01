import { range, isEqual } from "lodash";
import { useEffect, useMemo, useState } from "react";

import { ComputerInfo } from "@/lib/devices/types";
import { HeartbeatResponse, Vec3 } from "@/lib/packet";
import { WsConnection } from "@/lib/ws/connection";
import { BlockDetectionResponse } from "@/lib/packet/actions/block";

export type Block = {
    position: Vec3;
    name: string;
};

export const useComputerInfo = (conn: WsConnection) => {
    const [computers, setComputers] = useState<Record<number, ComputerInfo>>({});
    const [blocks, setBlocks] = useState<Block[]>([]);

    // useEffect(() => {
    //     (async () => {
    //         const r = await fetch("http://localhost:8000/api/memory");
    //         const { devices, blocks } = await r.json();
    //         setComputers(devices);
    //         setBlocks(blocks);
    //     })();
    // }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        conn.listenFor("response:block-detection", signal, (body) => {
            setBlocks((blocks) => {
                const newBlocks = applyBlockDetection(blocks, body);
                return newBlocks ?? blocks;
            });
            return computers;
        });

        conn.listenFor("response:position", signal, (body, sender) => {
            setComputers((computers) => {
                const computer = computers[sender];
                if (!computer) return computers;
                return {
                    ...computers,
                    [sender]: { ...computer, position: body.position },
                };
            });
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
    console.log({
        computers: computerList,
        blocks: blocks,
    });
    return {
        computers: computerList,
        blocks: blocks,
    };
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
            ? range(16).map((i) => body.deviceData?.inventory?.[i])
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

const applyBlockDetection = (
    blocks: Block[],
    body: BlockDetectionResponse,
): Block[] | undefined => {
    const { block: name, position } = body;

    const block: Block = {
        name: name,
        position: position,
    };
    const filteredBlocks = blocks.filter((v) => !isEqual(v.position, block.position));
    return [...filteredBlocks, block];
};
