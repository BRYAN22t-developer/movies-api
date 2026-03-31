import { Router } from "express";
import { createMoviesRouter } from "./movies.js";
import { createAuthRouter } from "./auth.js";
import type { AuthController, Authenticator } from "../types/auth.types.js";
import type { MoviesController } from "../controllers/movies.js";

export function createMainRouter({
  authenticator,
  authController,
  moviesController,
}: {
  authenticator: Authenticator;
  authController: AuthController;
  moviesController: MoviesController;
}): Router {
  const router = Router();

  router.use((req, res, next) => authenticator.authentication(req, res, next));

  router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Movies API!" });
  });

  router.use("/auth", createAuthRouter({ authenticator, authController }));

  router.use(
    "/movies",
    createMoviesRouter({ authenticator, moviesController }),
  );

  return router;
}
