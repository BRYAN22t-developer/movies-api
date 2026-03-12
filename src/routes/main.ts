import { Router } from "express";
import { createMoviesRouter } from "./movies.js";

export function createMainRouter(): Router {
    const router = Router();

    router.get("/", (req, res) => {
        res.json({ message: "Welcome to the Movies API!" });
    });

    router.use("/movies", createMoviesRouter());

    return router;
}