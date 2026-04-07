import type { Request, Response } from "express";
import type {
  ScheduleController,
  ScheduleFilterData,
  ScheduleService,
} from "../types/schedule.types.js";
import type { ScheduleSchema } from "../schemas/schedule.js";

export class DefaultScheduleController implements ScheduleController {
  private readonly scheduleService: ScheduleService;
  private readonly scheduleSchema: ScheduleSchema;

  constructor(
    scheduleService: ScheduleService,
    scheduleSchema: ScheduleSchema,
  ) {
    this.scheduleService = scheduleService;
    this.scheduleSchema = scheduleSchema;
  }

  async getSchedule(req: Request, res: Response): Promise<void | Response> {
    const result = this.scheduleSchema.validateScheduleFilters(req.query);
    const filters = result;
    const serviceResult = await this.scheduleService.getSchedule(
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
    const validationResult = this.scheduleSchema.validateSchedule(req.body);
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
    throw new Error("Method not implemented.");
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
