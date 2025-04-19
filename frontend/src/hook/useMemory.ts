import { fetchBlocks, fetchComputers, WsConnection } from "ccm-connection";
import { createMemoryBank } from "ccm-memory";
import { Block, Computer } from "ccm-packet";
import { useEffect, useState } from "react";

const HOSTNAME = "http://localhost:8000";

export const useMemory = (conn: WsConnection | undefined) => {
    const [blocks, setBlocks] = useState<Record<string, Block>>({});
    const [devices, setDevices] = useState<Record<number, Computer>>({});

    useEffect(() => {
        if (!conn) return;

        const controller = new AbortController();
        const { signal } = controller;
        const memory = createMemoryBank();

        (async () => {
            const blocks = await fetchBlocks(HOSTNAME);
            memory.feedBlocks(blocks);
        })();
        (async () => {
            const devices = await fetchComputers(HOSTNAME);
            memory.feedDevices(devices);
        })();

        memory.onBlockUpdates({
            callback: () => {
                console.log(memory.blocks);
                setBlocks(memory.blocks);
            },
            signal: signal,
        });
        memory.onDeviceUpdate({
            callback: () => {
                setDevices(memory.devices);
            },
            signal: signal,
        });

        conn.onPacket((packet) => {
            memory.feedPacket(packet);
        }, signal);

        return () => controller.abort();
    }, [conn]);

    return { blocks, devices };
};
