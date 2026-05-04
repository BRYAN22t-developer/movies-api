import { env } from "../config/env.js";
import type {
  AuthRepository,
  AuthService,
  LoginData,
  PermissionIsAllowedData,
  RegisterData,
  ServiceResult,
  UserAuthRecord,
} from "@/types/auth.types.js";
import bcrypt from "bcrypt";

export class DefaultAuthService implements AuthService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async getRoleIdByName(name: string): Promise<number | null> {
    const result = await this.authRepository.getRoleIdByName(name);
    return result;
  }

  async permissionIsAllowed(data: PermissionIsAllowedData): Promise<boolean> {
    const result = await this.authRepository.permissionIsAllowed(data);
    return result;
  }

  async register(data: RegisterData): Promise<ServiceResult<{ id: number }>> {
    const { username, password } = data;

    const SALT_ROUNDS = env.SALT_ROUNDS;
    const criptedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await this.authRepository.createUser({
      username,
      password: criptedPassword,
    });
    return result;
  }

  async login(
    data: LoginData,
  ): Promise<ServiceResult<{ id: number; message: string }>> {
    const { username, password } = data;
    const result = await this.authRepository.findUserByUsername(username);
    if (!result) return { ok: false, error: "user does not exist" };

    const passwordMatches = await bcrypt.compare(password, result.password);

    if (!passwordMatches) return { ok: false, error: "wrong password" };

    return { ok: true, data: { id: result.id, message: "login successfully" } };
  }

  async getUserById(id: number): Promise<UserAuthRecord | null> {
    return await this.authRepository.getUserById(id);
  }

  async deleteUserById(userId: number): Promise<void> {
    await this.authRepository.deleteUserById(userId);
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const SALT_ROUNDS = env.SALT_ROUNDS;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.authRepository.updateUserPassword(userId, hashedPassword);
  }

  async updateUser(
    id: number,
    data: { username?: string; password?: string },
  ): Promise<void> {
    const updateData: { username?: string; password?: string } = {};
    if (data.username) updateData.username = data.username;
    if (data.password) {
      const SALT_ROUNDS = env.SALT_ROUNDS;
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    await this.authRepository.updateUser(id, updateData);
  }

  async getusersWithRole(roleName: string): Promise<UserAuthRecord[]> {
    return await this.authRepository.getusersWithRole(roleName);
  }
}
