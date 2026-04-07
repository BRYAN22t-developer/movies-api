import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { createAuthRouter } from "./auth.js";
import type { AuthController, Authenticator } from "../types/auth.types.js";
import type { MoviesController as oldMoviesController } from "../controllers/oldMovies.js";
import type { MoviesController } from "../types/movies.types.js";
import { createSchedulesRouter } from "./schedules.js";
import type { ScheduleController } from "../types/schedule.types.js";

export function createMainRouter({
  authenticator,
  authController,
  oldMoviesController,
  moviesController,
  scheduleController,
}: {
  authenticator: Authenticator;
  authController: AuthController;
  oldMoviesController: oldMoviesController;
  moviesController: MoviesController;
  scheduleController: ScheduleController;
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
      oldMoviesController,
      moviesController,
    }),
  );

  router.use(
    "/schedules",
    createSchedulesRouter({ authenticator, scheduleController }),
  );

  return router;
}
