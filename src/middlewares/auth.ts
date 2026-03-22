import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const unAuthEndPoints = ["/", "/auth/login", "/auth/register"]

export function authentication(req: Request, res: Response, next: NextFunction) {
    if (endPointIsAllowed(req.path)) return next()

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

function endPointIsAllowed(path: string) {
    return unAuthEndPoints.includes(path)
}