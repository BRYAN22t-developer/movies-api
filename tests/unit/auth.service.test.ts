import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";

vi.mock("@/config/env.js", () => ({
  env: {
    PORT: 3000,
    DB_HOST: "localhost",
    DB_PORT: 3306,
    DB_NAME: "movies_test",
    DB_USER: "root",
    DB_PASSWORD: "",
    JWT_SECRET: "test_secret",
    SALT_ROUNDS: 5,
  },
}));

import type {
  AuthRepository,
  AuthService,
} from "../../src/types/auth.types.js";
import { env } from "@/config/env.js";

const { DefaultAuthService } = await import("@/services/auth.js");

describe("DefaultAuthService", () => {
  let authRepository: AuthRepository;
  let service: AuthService;

  beforeEach(() => {
    authRepository = {
      createUser: vi.fn(),
      findUserByUsername: vi.fn(),
      assignRoleToUser: vi.fn(),
      getRoleIdByName: vi.fn(),
      permissionIsAllowed: vi.fn(),
    };

    service = new DefaultAuthService(authRepository);
  });

  it("should return id if register works", async () => {
    vi.mocked(authRepository.createUser).mockResolvedValue({
      ok: true,
      data: { id: 1 },
    });

    const result = await service.register({
      username: "admin",
      password: "1234",
      role: "admin",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data?.id).toBe(1);
    }
  });

  const userLoginData = {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("1234", env.SALT_ROUNDS),
  };

  it("should return login data when credentials are correct", async () => {
    vi.mocked(authRepository.findUserByUsername).mockResolvedValue(
      userLoginData,
    );

    const result = await service.login({ username: "admin", password: "1234" });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data.message).toBe("login successfully");
      expect(result.data.id).toBe(1);
    }
  });

  it("should return message when username does not exist", async () => {
    vi.mocked(authRepository.findUserByUsername).mockResolvedValue(null);

    const result = await service.login({
      username: "worng_username",
      password: "1234",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe("user does not exist");
    }
  });

  it("should return message when password is incorrect", async () => {
    vi.mocked(authRepository.findUserByUsername).mockResolvedValue(
      userLoginData,
    );

    const result = await service.login({
      username: "admin",
      password: "wrong_password",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe("wrong password");
    }
  });

  it("should return id role if role exist", async () => {
    vi.mocked(authRepository.getRoleIdByName).mockResolvedValue(1);

    const result = await service.getRoleIdByName("admin");

    expect(result).toBe(1);
  });

  it("should return null if role does not exist", async () => {
    vi.mocked(authRepository.getRoleIdByName).mockResolvedValue(null);

    const result = await service.getRoleIdByName("wrong_role");

    expect(result).toBe(null);
  });

  it("should return true if user permission is allowed", async () => {
    vi.mocked(authRepository.permissionIsAllowed).mockResolvedValue(true);

    const result = await service.permissionIsAllowed({
      userId: 1,
      permission: "read:movies",
    });

    expect(result).toBe(true);
  });

  it("should return false if user permission is not allowed", async () => {
    vi.mocked(authRepository.permissionIsAllowed).mockResolvedValue(false);

    const result = await service.permissionIsAllowed({
      userId: 1,
      permission: "read:movies",
    });

    expect(result).toBe(false);
  });
});
