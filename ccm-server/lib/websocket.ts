import type { Express } from "express";
import type { Options as WebsocketOptions } from "express-ws";
import createExpressWs from "express-ws";
import { RequestPacket } from "./packet/packet";

export const computerMessageListeners: Map<string, (packet: string) => void> = new Map();
const clientMessageListeners: Map<string, (packet: string) => void> = new Map();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const generateId = () => (Math.random() * 2 ** 32).toString(16);
const fakeDelay = async () => {
    const duration = SLEEP_DURATION + SLEEP_VARY * (Math.random() * 2 - 1);
    await sleep(duration);
};

const SLEEP_DURATION = 100;
const SLEEP_VARY = 50;

export const createWebsocketExpress = (app: Express) => {
    const options = {
        wsOptions: {
            perMessageDeflate: undefined,
        },
    } satisfies WebsocketOptions;
    const expressWs = createExpressWs(app, undefined, options);

    expressWs.app.ws("/ws/client", function (ws) {
        const id = generateId();

        ws.on("message", async (data) => {
            await fakeDelay();

            const msg = data.toString("utf-8");
            for (const callback of clientMessageListeners.values()) {
                try {
                    callback(msg);
                } catch (e) {
                    console.error(e);
                }
            }
        });

        computerMessageListeners.set(id, (packet) => ws.send(packet));
        ws.on("close", () => computerMessageListeners.delete(id));
    });

    expressWs.app.ws("/ws/computer", function (ws) {
        const id = generateId();

        ws.on("open", () => {
            ws.send(
                JSON.stringify({
                    destination: "*",
                    body: { type: "request:heartbeat" },
                } satisfies RequestPacket),
            );
        });

        ws.on("message", async (data) => {
            await fakeDelay();

            const msg = data.toString("utf-8");
            for (const callback of computerMessageListeners.values()) {
                try {
                    callback(msg);
                } catch {}
            }
        });
        clientMessageListeners.set(id, (packet) => ws.send(packet));
        ws.on("close", () => clientMessageListeners.delete(id));
    });
};
