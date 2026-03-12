import express from "express";
import type { Express } from "express";

export function createServer(): Express {
    const app = express();
    app.disable("x-powered-by");

    app.use(express.json());

    return app;
}