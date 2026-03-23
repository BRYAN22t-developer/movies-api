import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { Auth } from "../middlewares/auth.js";
import { createAuthRouter } from "./auth.js";

export function createMainRouter(): Router {
    const router = Router();

    const authenticator = new Auth()
    router.use((req, res, next) => authenticator.authentication(req, res, next))

    router.get("/", (req, res) => {
        res.json({ message: "Welcome to the Movies API!" });
    });

    router.use("/auth", createAuthRouter())

    router.use("/movies", createMoviesRouter(authenticator));

    return router;
}