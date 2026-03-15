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
        const { genre, search, limit, offset } = req.query;
        
        const movies = await this.model.getMovies({ genre: genre as string, search: search as string, limit: Number(limit), offset: Number(offset) });
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
            res.status(400).json({ message: "Invalid movie data", errors: result.error })
        }

        const newMovie = await this.model.createMovie({ ...req.body })
        res.json(newMovie)
    }

    async createGenre(req: Request, res: Response) {
        const newGenre = await this.model.createGenre({ ...req.body })
        res.json(newGenre)
    }

    async deleteGenre(req: Request, res: Response) {
        const { id } = req.params;
        const parsedId = Number(id)
        const response = await this.model.removeGenre({ id: parsedId })
        res.sendStatus(204)
    }

    async deleteMovie(req: Request, res: Response) {
        const { id } = req.params
        const parsedId = Number(id)
        const result = await this.model.deleteMovie({ id: parsedId })
        res.sendStatus(204)
    }

    async updateMovie(req: Request, res: Response) {
        const result = await this.movieSchema.validatePartialMovie(req.body)
        if (!result.success) {
            res.status(400).json({ message: "invalid movie data", error: result.error })
        }

        const { id } = req.params
        const parsedId = Number(id)

        const updatedMovie = await this.model.updateMovie({ ...req.body, id: parsedId })
        res.json(updatedMovie)
    }

    //#endregion

    async getScheduleStates(req: Request, res: Response) {
        const states = await this.model.getScheduleStates()
        res.json(states)
    }

    async createScheduleState(req: Request, res: Response) {
        const state = await this.model.createScheduleState({ ...req.body })
        res.json(state)
    }

    async deleteScheduleState(req: Request, res: Response) {
        const { id } = req.params
        const parsedId = Number(id)
        const result = await this.model.deleteScheduleState({ id: parsedId })
        res.sendStatus(204)
    }

    async updateScheduleState(req: Request, res: Response){
        const { id } = req.params
        const parsedId = Number(id)
        const result = await this.model.updateScheduleState({ id: parsedId, ...req.body })
        res.json(result)
    }
}