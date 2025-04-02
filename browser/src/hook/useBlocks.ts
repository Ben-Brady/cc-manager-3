import { Vec3 } from "ccm-packet";
import { useEffect, useState } from "react";

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
            const { position, range } = body;
            if (!position) return;

            const newBlocks: Record<string, Block> = {};

            for (const block of body.blocks) {
                const blockPos = {
                    x: position.x + block.offset.x,
                    y: position.y + block.offset.y,
                    z: position.z + block.offset.z,
                };
                const key = toStringVec3(blockPos);
                newBlocks[key] = {
                    name: block.name,
                    lastDetected: Date.now(),
                    position: blockPos,
                };
            }

            const airBlocks: Record<string, Block> = {};
            for (let x = 1 - range; x < range; x++) {
                for (let y = 1 - range; y < body.range; y++) {
                    for (let z = 1 - range; z < range; z++) {
                        const blockPos = {
                            x: position.x + x,
                            y: position.y + y,
                            z: position.z + z,
                        };
                        const key = toStringVec3(blockPos);

                        airBlocks[key] = {
                            name: "minecraft:air",
                            lastDetected: Date.now(),
                            position: blockPos,
                        };
                    }
                }
            }
            setBlocks((blocks) => ({
                ...blocks,
                ...airBlocks,
                ...newBlocks,
            }));
        });
    }, [conn]);

    return blocks;
};
