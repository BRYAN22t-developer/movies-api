import { Router } from "express";
import { MoviesController } from "../controllers/movies.js";
import { MySQLModel } from "../models/mysql/main.js";
import type { Auth } from "../middlewares/auth.js";

export function createMoviesRouter(authorizator: Auth): Router {
    const router = Router();
    const moviesController = new MoviesController(new MySQLModel());

    router.get("/reservations", (req, res, next) => authorizator.authorization(req, res, next, "reservations:read"), (req, res) => {
        moviesController.getReservations(req, res)
    })

    router.get("/reservations/:id", (req, res, next) => authorizator.authorization(req, res, next, "reservations:read"), (req, res) => {
        moviesController.getReservationById(req, res)
    })

    //#region schedules

    router.get("/schedules/states", (req, res, next) => authorizator.authorization(req, res, next, "schedules:read"), (req, res) => {
        moviesController.getScheduleStates(req, res)
    })

    router.post("/schedules/states", (req, res, next) => authorizator.authorization(req, res, next, "schedules:create"), (req, res) => {
        moviesController.createScheduleState(req, res)
    })

    router.delete("/schedules/states/:id", (req, res, next) => authorizator.authorization(req, res, next, "schedules:delete"), (req, res) => {
        moviesController.deleteScheduleState(req, res)
    })

    router.patch("/schedules/states/:id", (req, res, next) => authorizator.authorization(req, res, next, "schedules:update"), (req, res) => {
        moviesController.updateScheduleState(req, res)
    })

    router.get("/schedules", (req, res, next) => authorizator.authorization(req, res, next, "schedules:read"), (req, res) => {
        moviesController.getSchedules(req, res)
    })

    router.get("/schedules/:id", (req, res, next) => authorizator.authorization(req, res, next, "schedules:read"), (req, res) => {
        moviesController.getScheduleById(req, res)
    })

    router.post("/schedules", (req, res, next) => authorizator.authorization(req, res, next, "schedules:update"), (req, res) => {
        moviesController.createSchedule(req, res)
    })

    router.patch("/schedules/:id", (req, res, next) => authorizator.authorization(req, res, next, "schedules:update"), (req, res) => {
        moviesController.updateSchedule(req, res)
    })

    //#endregion

    //#region movies genres

    router.get("/", (req, res, next) => authorizator.authorization(req, res, next, "movies:read"), (req, res) => {
        moviesController.getMovies(req, res);
    });

    router.post("/", (req, res, next) => authorizator.authorization(req, res, next, "movies:create"), (req, res) => {
        moviesController.createMovie(req, res)
    })

    router.get("/genres", (req, res, next) => authorizator.authorization(req, res, next, "movies:read"), (req, res) => {
        moviesController.getGenres(req, res)
    })

    router.post("/genres", (req, res, next) => authorizator.authorization(req, res, next, "movies:create"), (req, res) => {
        moviesController.createGenre(req, res)
    })

    router.get("/:id", (req, res, next) => authorizator.authorization(req, res, next, "movies:read"), (req, res) => {
        moviesController.getMovieById(req, res);
    });

    router.delete("/:id", (req, res, next) => authorizator.authorization(req, res, next, "movies:delete"), (req, res) => {
        moviesController.deleteMovie(req, res);
    });

    router.delete("/genres/:id", (req, res, next) => authorizator.authorization(req, res, next, "movies:delete"), (req, res) => {
        moviesController.deleteGenre(req, res)
    })

    router.patch("/:id", (req, res, next) => authorizator.authorization(req, res, next, "movies:update"), (req, res) => {
        moviesController.updateMovie(req, res);
    });

    //#endregion




    return router;
}