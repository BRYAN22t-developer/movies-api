import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/env.js", () => ({
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

const { DefaultAuthService } = await import("../../src/services/auth.js");

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
});
