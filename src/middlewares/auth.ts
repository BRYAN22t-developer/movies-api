import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { MySQLModel } from "../models/mysql/main.js";

const DEFAULT_UNAUTHENTICATED_ENDPOINTS = ["/", "/auth/login"]

export class Auth {
    private readonly unAuthenticatedEndPoints: String[]
    private readonly model: MySQLModel

    constructor(model: MySQLModel = new MySQLModel(), unAuthenticatedEndPoints: string[] = DEFAULT_UNAUTHENTICATED_ENDPOINTS) {
        this.unAuthenticatedEndPoints = unAuthenticatedEndPoints
        this.model = model
    }

    authentication(req: Request, res: Response, next: NextFunction) {
        if (this.endPointRequiresAuthentication(req.path)) return next()

        const authToken = req.cookies?.authToken

        if (!authToken) return res.json({ "Error": "Missing auth token" })

        try {
            const JWT_SECRET = process.env.JWT_SECRET
            if (!JWT_SECRET) throw new Error("SECRET_KEY is not defined")

            const payload = jwt.verify(authToken, JWT_SECRET) as Express.UserPayload
            req.user = payload
            return next()
        } catch (e) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    endPointRequiresAuthentication(path: string) {
        return this.unAuthenticatedEndPoints.includes(path)
    }

    async authorization(req: Request, res: Response, next: NextFunction, permission: string) {
        const authToken = req.cookies?.authToken
        if (!authToken) return res.json({ "Error": "Missing auth token" })
        try {
            const JWT_SECRET = process.env.JWT_SECRET
            if (!JWT_SECRET) throw new Error("SECRET_KEY is not defined")

            const payload = jwt.verify(authToken, JWT_SECRET) as Express.UserPayload
            req.user = payload

            const userId = await this.model.getUserIdByUsername({ username: payload.username })

            const hasPermission = await this.model.permissionIsAllowed({ userId: Number(userId), permission })

            if (!hasPermission) return res.json({ error: "Wrong access" })

            return next()
        } catch (e) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
}
