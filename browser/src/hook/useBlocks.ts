import { useCallback, useEffect, useRef, useState } from "react";

import { Vec3 } from "@/lib/packet";
import { toStringVec3 } from "@/lib/three/utils";
import { WsConnection } from "@/lib/ws/connection";

export type Block = {
    position: Vec3;
    name: string;
    lastDetected: number;
};

export const useBlocks = (conn: WsConnection | undefined): Record<string, Block> => {
    const [blocks, setBlocks] = useState<Record<string, Block>>({});

    useEffect(() => {
        (async () => {
            const r = await fetch("http://localhost:8000/api/blocks");
            const blockList = (await r.json()) as Block[];
            const storedBlocks = Object.fromEntries(
                blockList.map((v) => [toStringVec3(v.position), v]),
            );
            setBlocks((blocks) => ({ ...storedBlocks, ...blocks }));
        })();
    }, []);

    useEffect(() => {
        if (!conn) return;

        const controller = new AbortController();
        const signal = controller.signal;

        let deferedBlocks: Block[] = [];
        let timeout: undefined | any = undefined;

        conn.listenFor("update:block-detection", signal, (body) => {
            const { block: name, position } = body;

            const block: Block = {
                name: name,
                position: position,
                lastDetected: Date.now(),
            };
            deferedBlocks.push(block);

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const newBlocks = deferedBlocks.map((block) => [
                    toStringVec3(block.position),
                    block,
                ]);
                deferedBlocks = [];

                setBlocks((blocks) => ({ ...blocks, ...Object.fromEntries(newBlocks) }));
            }, 100);
        });

        conn.listenFor("response:scan", signal, (body) => {
            const newBlocks = body.blocks
                .map((v) => ({
                    name: v.block,
                    position: v.position,
                    lastDetected: Date.now(),
                }))
                .map((block) => [toStringVec3(block.position), block]);
            setBlocks((blocks) => ({
                ...blocks,
                ...Object.fromEntries(newBlocks),
            }));
        });
    }, [conn]);

    return blocks;
};
