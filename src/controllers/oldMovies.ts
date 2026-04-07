import type { Request, Response } from "express";
import type { MySQLModel } from "../models/mysql/main.js";
import { MovieSchema } from "../schemas/movies.js";

export class MoviesController {
  private readonly model: MySQLModel;
  private readonly movieSchema: MovieSchema;
  constructor(model: MySQLModel) {
    this.model = model;
    this.movieSchema = new MovieSchema();
  }

  async getReservations(req: Request, res: Response) {
    const reservations = await this.model.getReservations();
    res.json(reservations);
  }

  async getReservationById(req: Request, res: Response) {
    const { id } = req.params;
    const reservation = await this.model.getReservationById({ id: Number(id) });
    res.json(reservation);
  }
}
