import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { authentication } from "../middlewares/authentication.js";
import { createAuthRouter } from "./authentication.js";

export function createMainRouter(): Router {
    const router = Router();

    router.use(authentication)

    router.get("/", (req, res) => {
        res.json({ message: "Welcome to the Movies API!" });
    });

    router.use("/authentication", createAuthRouter())

    router.use("/movies", createMoviesRouter());

    return router;
}