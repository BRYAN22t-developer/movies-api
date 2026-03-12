import type { Request, Response } from "express";
import type { MySQLModel } from "../models/mysql/main.js";
import { MovieSchema } from "../schemas/movies.js";

export class MoviesController {
    private readonly model: MySQLModel;
    private readonly movieSchema: MovieSchema
    constructor(model: MySQLModel) {
        this.model = model;
        this.movieSchema = new MovieSchema(this.model.getGenres.bind(this.model));
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

    async getGenres(req: Request, res: Response) {
        const genres = await this.model.getGenres()
        res.json(genres)
    }

    async createMovie(req: Request, res: Response) {
        const result = await this.movieSchema.validateMovie(req.body);

        if (!result.success) {
            res.status(400).json({ message: "Invalid job data", errors: result.error })
        }

        const newMovie = await this.model.createMovie({ ...req.body })
        res.json(newMovie)
    }

}