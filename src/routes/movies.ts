import { Router } from "express";
import { MoviesController } from "../controllers/movies.js";
import { MySQLModel } from "../models/mysql/main.js";

export function createMoviesRouter(): Router {
    const router = Router();
    const moviesController = new MoviesController(new MySQLModel());

    router.get("/", (req, res) => {
        moviesController.getMovies(req, res);
    });
    
    return router;
}