import { getBlocks, getDevices } from "./lib/memory";
import { createWebsocketExpress } from "./lib/websocket";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
createWebsocketExpress(app);

app.get("/api/memory", (req, res) => {
    res.json({
        devices: getDevices(),
        blocks: getBlocks(),
    });
});

app.listen(8000, "0.0.0.0", () => {
    console.log("Serving on localhost:8000");
});
