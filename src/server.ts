import express from "express";
import type { Express } from "express";
import { createMainRouter } from "./routes/main.js";
import cookieParser from "cookie-parser";
import type { AuthController, Authenticator } from "./types/auth.types.js";
import type { MoviesController as oldMoviesController } from "./controllers/oldMovies.js";
import type { MoviesController } from "./types/movies.types.js";
import type { ScheduleController } from "./types/schedule.types.js";

export function createServer({
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
}): Express {
  const app = express();
  app.disable("x-powered-by");

  app.use(cookieParser());
  app.use(express.json());

  app.use(
    createMainRouter({
      authenticator,
      authController,
      oldMoviesController,
      moviesController,
      scheduleController,
    }),
  );

  return app;
}
