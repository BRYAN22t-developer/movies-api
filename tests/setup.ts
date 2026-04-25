import { vi } from "vitest";

vi.mock("@/config/env.js", () => ({
  env: {
    PORT: 3000,
    DB_HOST: "localhost",
    DB_PORT: 3306,
    DB_NAME: "movies_test",
    DB_USER: "root",
    DB_PASSWORD: "",
    JWT_SECRET: "test_secret",
    SALT_ROUNDS: 1,
  },
}));
