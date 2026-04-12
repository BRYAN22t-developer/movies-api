import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { createAuthRouter } from "./auth.js";
import type { AuthController, Authenticator } from "../types/auth.types.js";
import type { MoviesController } from "../types/movies.types.js";
import { createSchedulesRouter } from "./schedules.js";
import type { ScheduleController } from "../types/schedule.types.js";
import type { ReservationController } from "../types/reservation.types.js";
import { createRoomRouter } from "./room.js";
import type { RoomController } from "../types/rooms.types.js";

export function createMainRouter({
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
}): Router {
  const router = Router();

  router.use((req, res, next) => authenticator.authentication(req, res, next));

  router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Movies API!" });
  });

  router.use("/auth", createAuthRouter({ authenticator, authController }));

  router.use(
    "/movies",
    createMoviesRouter({
      authenticator,
      moviesController,
    }),
  );

  router.use(
    "/schedules",
    createSchedulesRouter({
      authenticator,
      scheduleController,
      reservationController,
    }),
  );

  router.use("/rooms", createRoomRouter({ roomController, authenticator }));

  return router;
}
