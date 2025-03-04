import { useEffect, useState } from "react";

import { Vec3 } from "@/lib/packet";
import { BlockDetectionResponse } from "@/lib/packet/actions/block";
import { WsConnection } from "@/lib/ws/connection";
import { vec3Compare } from "@/lib/packet/generic";

export type Block = {
    position: Vec3;
    name: string;
    lastDetected: number;
};

const posKey = (pos: Vec3) => `${pos.x},${pos.y},${pos.z}`;
export const useBlocks = (conn: WsConnection | undefined) => {
    const [blocks, setBlocks] = useState<Record<string, Block>>({});

    useEffect(() => {
        (async () => {
            const r = await fetch("http://localhost:8000/api/blocks");
            const blockList = (await r.json()) as Block[];
            const storedBlocks = Object.fromEntries(blockList.map((v) => [posKey(v.position), v]));
            setBlocks((blocks) => ({
                ...storedBlocks,
                ...blocks,
            }));
        })();
    }, []);

    useEffect(() => {
        if (!conn) return;

        const controller = new AbortController();
        const signal = controller.signal;

        conn.listenFor("update:block-detection", signal, (body) => {
            const { block: name, position } = body;

            const block: Block = {
                name: name,
                position: position,
                lastDetected: Date.now(),
            };
            setBlocks((blocks) => ({
                ...blocks,
                [posKey(block.position)]: block,
            }));
        });

        conn.listenFor("update:position", signal, (body) => {
            const block: Block = {
                name: "minecraft:air",
                position: body.position,
                lastDetected: Date.now(),
            };
            setBlocks((blocks) => ({
                ...blocks,
                [posKey(block.position)]: block,
            }));
        });
    }, [conn]);

    return Array.from(Object.values(blocks));
};
