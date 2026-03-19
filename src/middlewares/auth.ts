import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"

const unAuthEndPoints = ["/", "/login"]

export function auth(req: Request, res: Response, next: NextFunction ) {
    if (endPointIsAllowed(req.path)) return next()

    const authToken = req.cookies?.authToken

    if (!authToken) return res.json({ "Error": "Missing auth token" })

    try {
        const SECRET_KEY = process.env.SECRET_KEY
        if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined")

        const payload = jwt.verify(authToken, SECRET_KEY) as Express.UserPayload
        req.user = payload
        return next()
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

function endPointIsAllowed(path: string) {
    return unAuthEndPoints.includes(path)
}