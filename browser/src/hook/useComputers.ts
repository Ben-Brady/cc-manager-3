import { range } from "lodash";
import { useEffect, useMemo, useState } from "react";

import { ComputerInfo } from "@/lib/devices/types";
import { HeartbeatResponse } from "@/lib/packet";
import { WsConnection } from "@/lib/ws/connection";

export const useComputers = (conn: WsConnection | undefined) => {
    const [computers, setComputers] = useState<Record<number, ComputerInfo>>({});

    useEffect(() => {
        (async () => {
            const r = await fetch("http://localhost:8000/api/devices");
            const computers = (await r.json()) as ComputerInfo[];
            setComputers(Object.fromEntries(computers.map((v) => [v.id, v])));
        })();
    }, []);

    useEffect(() => {
        if (!conn) return;

        const controller = new AbortController();
        const signal = controller.signal;

        conn.listenFor("update:position", signal, (body, sender) => {
            setComputers((computers) => {
                const computer = computers[sender];
                if (!computer) return computers;
                return {
                    ...computers,
                    [sender]: { ...computer, position: body.position },
                };
            });
        });

        conn.listenFor("update:rotation", signal, (body, sender) => {
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
    return computerList;
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
    const fuel = body.deviceData.type === "turtle" ? body.deviceData.fuel : 0;

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
        fuel: fuel,
    };
};
