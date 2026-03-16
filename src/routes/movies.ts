import { Router } from "express";
import { MoviesController } from "../controllers/movies.js";
import { MySQLModel } from "../models/mysql/main.js";

export function createMoviesRouter(): Router {
    const router = Router();
    const moviesController = new MoviesController(new MySQLModel());

    router.get("/reservations", (req, res) => {
        moviesController.getReservations(req, res)
    })

    //#region schedules

    router.get("/schedules/states", (req, res) => {
        moviesController.getScheduleStates(req, res)
    })

    router.post("/schedules/states", (req, res) => {
        moviesController.createScheduleState(req, res)
    })

    router.delete("/schedules/states/:id", (req, res) => {
        moviesController.deleteScheduleState(req, res)
    })

    router.patch("/schedules/states/:id", (req, res) => {
        moviesController.updateScheduleState(req, res)
    })

     router.get("/schedules", (req, res) => {
        moviesController.getSchedules(req, res)
    })

    router.get("/schedules/:id", (req, res) => {
        moviesController.getScheduleById(req, res)
    })

    router.post("/schedules", (req, res) => {
        moviesController.createSchedule(req, res)
    })

    router.patch("/schedules/:id", (req, res) => {
        moviesController.updateSchedule(req, res)
    })

    //#endregion

    //#region movies genres

    router.get("/", (req, res) => {
        moviesController.getMovies(req, res);
    });

    router.post("/", (req, res) => {
        moviesController.createMovie(req, res)
    })

    router.get("/genres", (req, res) => {
        moviesController.getGenres(req, res)
    })

    router.post("/genres", (req, res) => {
        moviesController.createGenre(req, res)
    })

    router.get("/:id", (req, res) => {
        moviesController.getMovieById(req, res);
    });

    router.delete("/:id", (req, res) => {
        moviesController.deleteMovie(req, res);
    });

    router.delete("/genres/:id", (req, res) => {
        moviesController.deleteGenre(req, res)
    })

    router.patch("/:id", (req, res) => {
        moviesController.updateMovie(req, res);
    });

    //#endregion




    return router;
}