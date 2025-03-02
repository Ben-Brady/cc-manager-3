import { isEqual } from "lodash";
import { useEffect, useState } from "react";

import { Vec3 } from "@/lib/packet";
import { BlockDetectionResponse } from "@/lib/packet/actions/block";
import { WsConnection } from "@/lib/ws/connection";

export type Block = {
    position: Vec3;
    name: string;
    lastDetected: number;
};

export const useBlocks = (conn: WsConnection | undefined) => {
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        (async () => {
            const r = await fetch("http://localhost:8000/api/blocks");
            const blocks = await r.json();
            setBlocks(blocks);
        })();
    }, []);

    useEffect(() => {
        if (!conn) return;

        const controller = new AbortController();
        const signal = controller.signal;

        conn.listenFor("update:block-detection", signal, (body) => {
            setBlocks((blocks) => {
                const newBlocks = applyBlockDetection(blocks, body);
                return newBlocks ?? blocks;
            });
        });
    }, [conn]);

    return blocks;
};

const applyBlockDetection = (
    blocks: Block[],
    body: BlockDetectionResponse,
): Block[] | undefined => {
    const { block: name, position } = body;

    const block: Block = {
        name: name,
        position: position,
        lastDetected: Date.now(),
    };
    const filteredBlocks = blocks.filter((v) => !isEqual(v.position, block.position));
    return [...filteredBlocks, block];
};
