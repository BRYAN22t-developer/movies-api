import type {
  AuthRepository,
  AuthService,
  LoginData,
  PermissionIsAllowedData,
  RegisterData,
  ServiceResult,
} from "../types/auth.types.js";
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

    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
    if (!SALT_ROUNDS) throw new Error("SALT_ROUNDS is not defined");
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
}
