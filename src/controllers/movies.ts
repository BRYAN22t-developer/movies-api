import type { Request, Response } from "express";
import type { MySQLModel } from "../models/mysql/main.js";

export class MoviesController {
    private readonly model: MySQLModel;
    constructor(model: MySQLModel) {
        this.model = model;
    }

    async getMovies(req: Request, res: Response) {
        const { genre, search } = req.query;

        const movies = await this.model.getMovies({ genre: genre as string, search: search as string });
        res.json(movies);
    }

    async getMovieById(req: Request, res: Response) {
        const { id } = req.params;
        const parsedId = Number(id);
        const movie = await this.model.getMovieById({ id: parsedId });
        res.json(movie);
    }


}