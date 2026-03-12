import express from "express";
import type { Express } from "express";
import { createMainRouter } from "./routes/main.js";

export function createServer(): Express {
    const app = express();
    app.disable("x-powered-by");

    app.use(express.json());

    app.use("/", createMainRouter());

    return app;
}