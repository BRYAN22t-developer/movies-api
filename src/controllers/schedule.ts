import type { Request, Response } from "express";
import type {
  ScheduleController,
  ScheduleFilterData,
  ScheduleService,
} from "../types/schedule.types.js";
import type { ScheduleSchema } from "../schemas/schedule.js";
import type { MoviesService } from "../types/movies.types.js";
import { title } from "process";

export class DefaultScheduleController implements ScheduleController {
  private readonly scheduleService: ScheduleService;
  private readonly scheduleSchema: ScheduleSchema;
  private readonly moviesService: MoviesService;

  constructor(
    scheduleService: ScheduleService,
    scheduleSchema: ScheduleSchema,
    moviesService: MoviesService,
  ) {
    this.scheduleService = scheduleService;
    this.scheduleSchema = scheduleSchema;
    this.moviesService = moviesService;
  }
  async getScheduleStates(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const serviceResult = await this.scheduleService.getScheduleStates();
    if (!serviceResult.ok) {
      return res.status(500).json({ error: serviceResult.error });
    }
    res.status(200).json(serviceResult.data);
  }
  async createScheduleState(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const serviceResult = await this.scheduleService.createScheduleState(
      req.body.state,
    );
    if (!serviceResult.ok) {
      return res.status(500).json({ error: serviceResult.error });
    }
    res.status(201).json(serviceResult.data);
  }
  async deleteScheduleState(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid schedule state ID" });
    }
    const serviceResult =
      await this.scheduleService.deleteScheduleState(parsedId);
    if (!serviceResult.ok) {
      return res.status(404).json({ error: serviceResult.error });
    }
    res.status(200).json({ message: "Schedule state deleted successfully" });
  }
  async updateScheduleState(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid schedule state ID" });
    }
    const serviceResult = await this.scheduleService.updateScheduleState(
      parsedId,
      req.body.state,
    );
    if (!serviceResult.ok) {
      return res.status(404).json({ error: serviceResult.error });
    }
    res.status(200).json(serviceResult.data);
  }

  async getSchedules(req: Request, res: Response): Promise<void | Response> {
    const result = this.scheduleSchema.validateScheduleFilters(req.query);
    const filters = result;
    const serviceResult = await this.scheduleService.getSchedules(
      filters as ScheduleFilterData,
    );
    if (!serviceResult.ok) {
      return res.status(500).json({ error: serviceResult.error });
    }
    res.status(200).json(serviceResult.data);
  }

  async getScheduleById(req: Request, res: Response): Promise<void | Response> {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid schedule ID" });
    }
    const serviceResult = await this.scheduleService.getScheduleById(parsedId);
    if (!serviceResult.ok) {
      return res.status(404).json({ error: serviceResult.error });
    }
    res.status(200).json(serviceResult.data);
  }

  async createSchedule(req: Request, res: Response): Promise<void | Response> {
    const movie = await this.moviesService.findById(req.body.movieId);
    if (!movie.ok) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    const title = movie?.data?.title;
    const validationResult = this.scheduleSchema.validateSchedule({
      ...req.body,
      title,
    });
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error });
    }
    const serviceResult = await this.scheduleService.createSchedule(
      validationResult.data,
    );
    if (!serviceResult.ok) {
      return res.status(500).json({ error: serviceResult.error });
    }
    res.status(201).json(serviceResult.data);
  }

  async updateSchedule(req: Request, res: Response): Promise<void | Response> {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid schedule ID" });
    }

    const movie = await this.moviesService.findById(req.body.movieId);
    if (!movie.ok) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const title = movie?.data?.title;

    const validationResult = this.scheduleSchema.validatePartialSchedule({
      ...req.body,
      title,
    });

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error });
    }
    const serviceResult = await this.scheduleService.updateSchedule(
      parsedId,
      validationResult.data as ScheduleFilterData,
    );
    if (!serviceResult.ok) {
      return res.status(404).json({ error: serviceResult.error });
    }
    res.status(200).json(serviceResult.data);
  }

  async deleteSchedule(req: Request, res: Response): Promise<void | Response> {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid schedule ID" });
    }
    const serviceResult = await this.scheduleService.deleteSchedule(parsedId);
    if (!serviceResult.ok) {
      return res.status(404).json({ error: serviceResult.error });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  }
}
