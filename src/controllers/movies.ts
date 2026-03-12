import type { Request, Response } from "express";

//TODO: REEMPLACE FOR DEPENDENCY INJECTION
import { MySQLModel } from "../models/mysql.js";

export class MoviesController{
    //TODO: MAKE TYPE FOR BASE MODEL
    private model: any;
    constructor() {
        this.model = new MySQLModel();
    }

    async getMovies(req: Request, res: Response) {
        const movies = await this.model.getMovies();
        res.json(movies);
    }
}