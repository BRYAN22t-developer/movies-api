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

  //#region schedules

  async getScheduleStates(req: Request, res: Response) {
    const states = await this.model.getScheduleStates();
    res.json(states);
  }

  async createScheduleState(req: Request, res: Response) {
    const state = await this.model.createScheduleState({ ...req.body });
    res.status(201).json(state);
  }

  async deleteScheduleState(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = Number(id);
    const result = await this.model.deleteScheduleState({ id: parsedId });
    res.sendStatus(204);
  }

  async updateScheduleState(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = Number(id);
    const result = await this.model.updateScheduleState({
      id: parsedId,
      ...req.body,
    });
    res.json(result);
  }

  async getSchedules(req: Request, res: Response) {
    const { startDate, endDate, startTime, endTime } = req.query;
    const schedules = await this.model.getSchedules({
      startDate: startDate as string,
      endDate: endDate as string,
      startTime: startTime as string,
      endTime: endTime as string,
    });
    res.json(schedules);
  }

  async getScheduleById(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = Number(id);
    const schedule = await this.model.getScheduleById({ id: parsedId });
    res.json(schedule);
  }

  async createSchedule(req: Request, res: Response) {
    const newSchedule = await this.model.createSchedule({ ...req.body });
    res.status(201).json(newSchedule);
  }

  async updateSchedule(req: Request, res: Response) {
    const { id } = req.params;
    const updatedSchedule = await this.model.updateSchedule({
      ...req.body,
      id: Number(id),
    });
    res.json(updatedSchedule);
  }

  //#endregion

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
