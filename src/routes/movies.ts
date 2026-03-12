import { Router } from "express";
import { MoviesController } from "../controllers/movies.js";
import { MySQLModel } from "../models/mysql/main.js";

export function createMoviesRouter(): Router {
    const router = Router();
    const moviesController = new MoviesController(new MySQLModel());

    router.get("/", (req, res) => {
        moviesController.getMovies(req, res);
    });

    router.get("/genres", (req, res) => {
        moviesController.getGenres(req, res)
    })

    router.get("/:id", (req, res) => {
        moviesController.getMovieById(req, res);
    });

    router.post("/", (req, res) => {
        moviesController.createMovie(req, res)
    })

    return router;
}