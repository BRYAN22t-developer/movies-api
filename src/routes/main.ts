import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { auth } from "../middlewares/auth.js";
import Jwt from "jsonwebtoken";
import { MySQLModel } from "../models/mysql/main.js";

export function createMainRouter(): Router {
    const router = Router();

    router.use((req, res, next) => {
        auth(req, res, next)
    })

    router.get("/", (req, res) => {
        res.json({ message: "Welcome to the Movies API!" });
    });

    router.post("/login", async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) return res.json({ Error: "Invalid Data" });

        const model = new MySQLModel

        const result = await model.login({ username, password });

        if (result?.Error) {
            return res.json(result);
        }

        const token = Jwt.sign({ username }, process.env.JWT_SECRET ?? "SECRET", {
            expiresIn: "30s",
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 /* * 60 */ * 1000,
        });
        res.json(result)
    })

    router.use("/movies", createMoviesRouter());

    return router;
}