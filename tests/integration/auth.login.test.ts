import request from "supertest";
import { describe, it, expect } from "vitest";
import { createServer } from "@/server.js";
import { createDependencies } from "@/depencencies.js";

describe("Login", () => {
  let app: ReturnType<typeof createServer>;
  let authCookie: string[];

  beforeAll(async () => {
    app = createServer(createDependencies());
  });

  beforeEach(async () => {
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "1234" });

    const rawCookie = loginResponse.headers["set-cookie"];

    if (!rawCookie) {
      throw new Error("Login did not return set-cookie header");
    }

    authCookie = Array.isArray(rawCookie) ? rawCookie : [rawCookie];
  });

  it("should login successfully with correct credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "1234" });
    expect(response.status).toBe(200);
  });

  it("should fail login with incorrect credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "wrong_password" });
    expect(response.status).toBe(401);
  });

  it("should fail login with non-existent username", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "non_existent_user", password: "password" });
    expect(response.status).toBe(401);
  });
});
