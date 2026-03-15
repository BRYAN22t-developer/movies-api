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

    //#region Movies and genres

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

    async createGenre(req: Request, res: Response) {
        const newGenre = await this.model.createGenre({ ...req.body })
        res.json(newGenre)
    }

    async removeGenre(req: Request, res: Response) {
        const { id } = req.params;
        const parsedId = Number(id)
        const response = await this.model.removeGenre({ id: parsedId })
        res.status(204)
    }

    //#endregion

    async getScheduleStates(req: Request, res: Response){
        const states = await this.model.getScheduleStates()
        res.json(states)
    }

    async createScheduleState(req: Request, res: Response){
        const state = await this.model.createScheduleState({...req.body})
        res.json(state)
    }

    
}