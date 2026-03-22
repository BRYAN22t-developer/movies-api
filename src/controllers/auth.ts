import type { Request, Response } from "express";
import { MySQLModel } from "../models/mysql/main.js";
import Jwt from "jsonwebtoken"

export class AuthController{
    private readonly model: MySQLModel
    constructor(model: MySQLModel){
        this.model = model
    }

    async login (req: Request, res: Response) {
        const { username, password } = req.body;
        if (!username || !password) return res.json({ Error: "Invalid Data" });

        const result = await this.model.login({ username, password });

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
    }
}