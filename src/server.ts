import express from "express";
import type { Express } from "express";
import { createMainRouter } from "./routes/main.js";
import cookieParser from "cookie-parser";
import type {
  AuthControllerContract,
  AuthenticatorContract,
} from "./types/auth.types.js";
import type { MoviesController } from "./controllers/movies.js";

export function createServer({
  authenticator,
  authController,
  moviesController,
}: {
  authenticator: AuthenticatorContract;
  authController: AuthControllerContract;
  moviesController: MoviesController;
}): Express {
  const app = express();
  app.disable("x-powered-by");

  app.use(cookieParser());
  app.use(express.json());

  app.use(
    createMainRouter({ authenticator, authController, moviesController }),
  );

  return app;
}
