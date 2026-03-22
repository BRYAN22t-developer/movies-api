import type { Request, Response } from "express";
import { MySQLModel } from "../models/mysql/main.js";
import Jwt from "jsonwebtoken"

export class AuthController {
    private readonly model: MySQLModel
    constructor(model: MySQLModel) {
        this.model = model
    }

    async register(req: Request, res: Response) {
        const { username, password } = req.body;
        const result = await this.model.register({username, password})
        res.json(result)
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        if (!username || !password) return res.json({ Error: "Invalid Data" });

        const result = await this.model.login({ username, password });

        if (result?.Error) {
            return res.json(result);
        }

        if (!process.env.JWT_SECRET) throw new Error("SECRET_KEY is not defined")

        const authToken = Jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: "30m",
        });

        res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 * 60 * 1000,
        });
        res.json(result)
    }
}