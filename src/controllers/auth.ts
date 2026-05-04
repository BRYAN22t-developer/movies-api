import type { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import type { AuthController, AuthService } from "../types/auth.types.js";
import { env } from "../config/env.js";

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

    const authToken = Jwt.sign(
      {
        id: result.data.id,
        username,
      },
      env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json(result);
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id as string, 10);
    if (isNaN(userId))
      return res.status(400).json({ error: "Invalid user ID" });

    const user = await this.authService.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ ok: true, data: user });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id as string, 10);
    if (isNaN(userId))
      return res.status(400).json({ error: "Invalid user ID" });

    await this.authService.deleteUserById(userId);
    res.status(204).send();
  }

  async updatePassword(req: Request, res: Response) {
    const { id } = req.params;
    const { newPassword } = req.body;
    const userId = parseInt(id as string, 10);
    if (isNaN(userId) || !newPassword)
      return res.status(400).json({ error: "Invalid data" });

    await this.authService.updateUserPassword(userId, newPassword);
    res.json({ ok: true, message: "Password updated" });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { username, password } = req.body;
    const userId = parseInt(id as string, 10);
    if (isNaN(userId))
      return res.status(400).json({ error: "Invalid user ID" });

    await this.authService.updateUser(userId, { username, password });
    res.json({ ok: true, message: "User updated" });
  }

  async getUsersWithRole(req: Request, res: Response) {
    const { roleName } = req.params;
    const users = await this.authService.getusersWithRole(roleName as string);
    res.json({ ok: true, data: users });
  }
}
