import { Block, Computer } from "ccm-packet";

export const fetchComputers = async (hostname: string): Promise<Computer[]> => {
    const r = await fetch(hostname + "/api/devices");
    const data = await r.json();
    const computers = Computer.array().parse(data);
    return computers;
};

export const fetchBlocks = async (hostname: string): Promise<Block[]> => {
    const r = await fetch(hostname + "/api/blocks");
    const data = await r.json();
    const blocks = Block.array().parse(data);
    return blocks;
};
