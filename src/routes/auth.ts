import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { MySQLModel } from "../models/mysql/main.js";
import { Auth } from "../middlewares/auth.js";

export function createAuthRouter(authenticator: Auth): Router{
    const router = Router()

    const authController = new AuthController(new MySQLModel())

    router.post("/register", (req, res, next) => authenticator.authorization(req, res, next, "users:create"), (req, res) => {
        authController.register(req, res)
    })

    router.post("/login", (req, res) => {
        authController.login(req, res)
    })

    return router
}