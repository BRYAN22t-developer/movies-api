import request from "supertest";
import { describe, it, expect } from "vitest";
import { createServer } from "@/server.js";
import { createDependencies } from "@/depencencies.js";

describe.sequential("Reservation concurrency", () => {
  let app: ReturnType<typeof createServer>;
  let authCookie: string[];
  let reservationId: number;

  beforeAll(async () => {
    app = createServer(createDependencies());
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "1234" });

    const rawCookie = loginResponse.headers["set-cookie"];

    if (!rawCookie) {
      throw new Error("Login did not return set-cookie header");
    }

    authCookie = Array.isArray(rawCookie) ? rawCookie : [rawCookie];
  });

  afterEach(async () => {
    await request(app)
      .delete(`/schedules/reservations/${reservationId}`)
      .set("Cookie", authCookie);
  });

  it("should not reserve the same seat twice", async () => {
    const scheduleId = 7;
    const payload = {
      stateId: 3,
      seatId: 5,
    };

    const responses = await Promise.all(
      Array.from({ length: 10 }, () =>
        request(app)
          .post(`/schedules/${scheduleId}/reservations`)
          .set("Cookie", authCookie)
          .send(payload),
      ),
    );

    const successful = responses.filter((res) => res.status === 201);
    const conflicts = responses.filter((res) => res.status === 409);

    expect(successful).toHaveLength(1);
    expect(conflicts).toHaveLength(9);

    const id = successful[0]?.body?.id;

    expect(id).toBeDefined();
    reservationId = id;
  });
});
