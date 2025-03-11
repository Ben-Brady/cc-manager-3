import { getBlocks, getDevices } from "./lib/memory";
import { createWebsocketExpress } from "./lib/websocket";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
createWebsocketExpress(app);

app.get("/api/devices", (req, res) => {
    res.json(getDevices());
});

app.get("/api/blocks", (req, res) => {
    res.json(getBlocks());
});

app.listen(8000, "127.0.0.1", () => {
    console.log("Serving on localhost:8000");
});
