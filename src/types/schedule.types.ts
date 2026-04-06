import type { Request, Response } from "express";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type Schedule = {
  movieId: number;
  roomId: number;
  stateId: number;
  title: string;
  startTime: string;
  endTime: string;
};

export type createScheduleData = Omit<Schedule, "id">;
export type updateScheduleData = Partial<createScheduleData>;

export interface ScheduleRepository {
  getSchedule(): Promise<ServiceResult<Schedule[]>>;
  getScheduleById(id: number): Promise<ServiceResult<Schedule>>;
  createSchedule(data: createScheduleData): Promise<ServiceResult<Schedule>>;
  updateSchedule(
    id: number,
    data: updateScheduleData,
  ): Promise<ServiceResult<Schedule>>;
}

export interface ScheduleService {
  getSchedule(): Promise<ServiceResult<Schedule[]>>;
  getScheduleById(id: number): Promise<ServiceResult<Schedule>>;
  createSchedule(data: createScheduleData): Promise<ServiceResult<Schedule>>;
  updateSchedule(
    id: number,
    data: updateScheduleData,
  ): Promise<ServiceResult<Schedule>>;
}

export interface ScheduleController {
  getSchedule(req: Request, res: Response): Promise<void | Response>;
  getScheduleById(req: Request, res: Response): Promise<void | Response>;
  createSchedule(req: Request, res: Response): Promise<void | Response>;
  updateSchedule(req: Request, res: Response): Promise<void | Response>;
}
