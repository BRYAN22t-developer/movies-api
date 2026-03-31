import type { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import type { AuthController, AuthService } from "../types/auth.types.js";

export class HttpAuthController implements AuthController {
  private readonly authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response) {
    const { username, password, role } = req.body;
    const result = await this.authService.register({
      username,
      password,
      role,
    });
    res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ Error: "Invalid Data" });

    const result = await this.authService.login({ username, password });

    if (!result.ok) {
      return res.status(401).json(result);
    }

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

    const authToken = Jwt.sign(
      {
        id: result.data.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      },
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });
    res.json(result);
  }
}
