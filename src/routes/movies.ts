import { Router } from "express";
import type { Authenticator } from "../types/auth.types.js";
import type { MoviesController } from "../types/movies.types.js";

export function createMoviesRouter({
  authenticator,
  moviesController,
}: {
  authenticator: Authenticator;
  moviesController: MoviesController;
}): Router {
  const router = Router();

  router.get(
    "/",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:read"),
    (req, res) => {
      moviesController.getMovies(req, res);
    },
  );

  router.post(
    "/",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:create"),
    (req, res) => {
      moviesController.createMovie(req, res);
    },
  );

  router.get(
    "/genres",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:read"),
    (req, res) => {
      moviesController.getGenres(req, res);
    },
  );

  router.post(
    "/genres",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:create"),
    (req, res) => {
      moviesController.createGenre(req, res);
    },
  );

  router.get(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:read"),
    (req, res) => {
      moviesController.getMovieById(req, res);
    },
  );

  router.delete(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:delete"),
    (req, res) => {
      moviesController.deleteMovieById(req, res);
    },
  );

  router.delete(
    "/genres/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:delete"),
    (req, res) => {
      moviesController.deleteGenreById(req, res);
    },
  );

  router.patch(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "movies:update"),
    (req, res) => {
      moviesController.updateMovieById(req, res);
    },
  );

  return router;
}
