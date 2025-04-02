import express from "express";
import cors from "cors";

import { getBlocks, getDevices } from "./memory";
import { attachWebsocketEndpoints } from "./websocket";

const app = express();
app.use(cors());
attachWebsocketEndpoints(app);

app.get("/api/devices", (req, res) => {
    const devices = getDevices();
    res.json(devices);
});

app.get("/api/blocks", (req, res) => {
    const blocks = getBlocks();
    res.json(blocks);
});

app.listen(8000, "127.0.0.1", () => {
    console.log("Serving on localhost:8000");
});
