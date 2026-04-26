import express from "express";
import type { Express } from "express";
import { createMainRouter } from "./routes/main.js";
import cookieParser from "cookie-parser";
import type { AuthController, Authenticator } from "./types/auth.types.js";
import type { MoviesController } from "./types/movies.types.js";
import type { ScheduleController } from "./types/schedule.types.js";
import type { ReservationController } from "./types/reservation.types.js";
import type { RoomController } from "./types/rooms.types.js";
import { defaultRateLimit } from "./middlewares/rate-limit.js";
import cors from "cors";

export function createServer({
  authenticator,
  authController,
  moviesController,
  scheduleController,
  reservationController,
  roomController,
}: {
  authenticator: Authenticator;
  authController: AuthController;
  moviesController: MoviesController;
  scheduleController: ScheduleController;
  reservationController: ReservationController;
  roomController: RoomController;
}): Express {
  const app = express();
  app.disable("x-powered-by");

  app.use(defaultRateLimit());
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());

  app.use(
    createMainRouter({
      authenticator,
      authController,
      moviesController,
      scheduleController,
      reservationController,
      roomController,
    }),
  );

  return app;
}
