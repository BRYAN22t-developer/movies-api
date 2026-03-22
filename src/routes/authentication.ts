import { Router } from "express";
import { AuthController } from "../controllers/authentication.js";
import { MySQLModel } from "../models/mysql/main.js";

export function createAuthRouter(): Router{
    const router = Router()

    const authController = new AuthController(new MySQLModel())

    router.post("/register", (req, res) => {
        authController.register(req, res)
    })

    router.post("/login", (req, res) => {
        authController.login(req, res)
    })

    return router
}