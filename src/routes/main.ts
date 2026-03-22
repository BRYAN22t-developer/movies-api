import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { authentication } from "../middlewares/auth.js";
import { createAuthRouter } from "./auth.js";

export function createMainRouter(): Router {
    const router = Router();

    router.use(authentication)

    router.get("/", (req, res) => {
        res.json({ message: "Welcome to the Movies API!" });
    });

    router.use("/auth", createAuthRouter())

    router.use("/movies", createMoviesRouter());

    return router;
}