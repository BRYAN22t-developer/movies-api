import bcrypt from "bcrypt";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

vi.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
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
  const hashMock = bcrypt.hash as unknown as Mock;
  const compareMock = bcrypt.compare as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    authRepository = {
      createUser: vi.fn(),
      findUserByUsername: vi.fn(),
      assignRoleToUser: vi.fn(),
      getRoleIdByName: vi.fn(),
      permissionIsAllowed: vi.fn(),
    };

    service = new DefaultAuthService(authRepository);
  });

  describe("register", () => {
    it("should return id if register works", async () => {
      hashMock.mockResolvedValue("hashed_password");

      vi.mocked(authRepository.createUser).mockResolvedValue({
        ok: true,
        data: { id: 1 },
      });

      const result = await service.register({
        username: "admin",
        password: "password",
        role: "admin",
      });

      expect(result.ok).toBe(true);

      expect(hashMock).toHaveBeenCalledWith("password", env.SALT_ROUNDS);

      expect(hashMock).toHaveBeenCalledBefore(
        vi.mocked(authRepository.createUser),
      );

      expect(authRepository.createUser).toHaveBeenCalledWith({
        username: "admin",
        password: "hashed_password",
      });

      if (result.ok) {
        expect(result.data?.id).toBe(1);
      }
    });
  });

  describe("login", () => {
    const userLoginData = {
      id: 1,
      username: "admin",
      password: "hashed_password",
    };

    it("should return login data when credentials are correct", async () => {
      compareMock.mockResolvedValue(true);
      vi.mocked(authRepository.findUserByUsername).mockResolvedValue(
        userLoginData,
      );

      const result = await service.login({
        username: "admin",
        password: "password",
      });

      expect(result.ok).toBe(true);
      expect(compareMock).toHaveBeenCalledAfter(
        vi.mocked(authRepository.findUserByUsername),
      );
      expect(compareMock).toHaveBeenCalledWith(
        "password",
        userLoginData.password,
      );
      expect(authRepository.findUserByUsername).toHaveBeenCalledWith("admin");
      expect(authRepository.findUserByUsername).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledTimes(1);

      if (result.ok) {
        expect(result.data.message).toBe("login successfully");
        expect(result.data.id).toBe(1);
      }
    });

    it("should return message when username does not exist", async () => {
      vi.mocked(authRepository.findUserByUsername).mockResolvedValue(null);

      const result = await service.login({
        username: "wrong_username",
        password: "password",
      });

      expect(result.ok).toBe(false);
      expect(authRepository.findUserByUsername).toHaveBeenCalledWith(
        "wrong_username",
      );
      expect(compareMock).not.toHaveBeenCalled();

      if (!result.ok) {
        expect(result.error).toBe("user does not exist");
      }
    });

    it("should return message when password is incorrect", async () => {
      compareMock.mockResolvedValue(false);
      vi.mocked(authRepository.findUserByUsername).mockResolvedValue(
        userLoginData,
      );

      const result = await service.login({
        username: "admin",
        password: "wrong_password",
      });

      expect(result.ok).toBe(false);
      expect(compareMock).toHaveBeenCalledAfter(
        vi.mocked(authRepository.findUserByUsername),
      );
      expect(compareMock).toHaveBeenCalledWith(
        "wrong_password",
        userLoginData.password,
      );
      expect(authRepository.findUserByUsername).toHaveBeenCalledWith("admin");

      if (!result.ok) {
        expect(result.error).toBe("wrong password");
      }
    });
  });

  describe("role", () => {
    it("should return id role if role exist", async () => {
      vi.mocked(authRepository.getRoleIdByName).mockResolvedValue(1);

      const result = await service.getRoleIdByName("admin");

      expect(result).toBe(1);
      expect(authRepository.getRoleIdByName).toHaveBeenCalledWith("admin");
    });

    it("should return null if role does not exist", async () => {
      vi.mocked(authRepository.getRoleIdByName).mockResolvedValue(null);

      const result = await service.getRoleIdByName("wrong_role");

      expect(result).toBe(null);
      expect(authRepository.getRoleIdByName).toHaveBeenCalledWith("wrong_role");
    });
  });

  describe("permission", () => {
    it("should return true if user permission is allowed", async () => {
      vi.mocked(authRepository.permissionIsAllowed).mockResolvedValue(true);

      const result = await service.permissionIsAllowed({
        userId: 1,
        permission: "read:movies",
      });

      expect(result).toBe(true);
      expect(authRepository.permissionIsAllowed).toHaveBeenCalledWith({
        userId: 1,
        permission: "read:movies",
      });
    });

    it("should return false if user permission is not allowed", async () => {
      vi.mocked(authRepository.permissionIsAllowed).mockResolvedValue(false);

      const result = await service.permissionIsAllowed({
        userId: 1,
        permission: "read:movies",
      });

      expect(result).toBe(false);
      expect(authRepository.permissionIsAllowed).toHaveBeenCalledWith({
        userId: 1,
        permission: "read:movies",
      });
    });
  });
});
