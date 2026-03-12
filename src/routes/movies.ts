import { Router } from "express";
import { MoviesController } from "../controllers/movies.js";

export function createMoviesRouter(): Router {
    const router = Router();
    const moviesController = new MoviesController();

    router.get("/", (req, res) => {
        moviesController.getMovies(req, res);
    });

    return router;
}