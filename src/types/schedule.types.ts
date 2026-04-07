import type { Request, Response } from "express";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type ScheduleFilterData = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
};

export type Schedule = {
  title: string;
  start_date: string;
  start_time: string;
  room: string;
  state: string;
};

export type createScheduleData = {
  movieId: number;
  roomId: number;
  startDate: string;
  startTime: string;
  stateId: number;
};
export type updateScheduleData = Partial<createScheduleData>;

export interface ScheduleRepository {
  getSchedules(
    filters?: ScheduleFilterData,
  ): Promise<ServiceResult<Schedule[]>>;
  getScheduleById(id: number): Promise<ServiceResult<Schedule>>;
  createSchedule(data: createScheduleData): Promise<ServiceResult<Schedule>>;
  updateSchedule(
    id: number,
    data: updateScheduleData,
  ): Promise<ServiceResult<Schedule>>;
  deleteSchedule(id: number): Promise<ServiceResult<null>>;

  getScheduleStates(): Promise<ServiceResult<{ id: number; state: string }[]>>;
  createScheduleState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
  deleteScheduleState(id: number): Promise<ServiceResult<null>>;
  updateScheduleState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
}

export interface ScheduleService {
  getSchedules(
    filters?: ScheduleFilterData,
  ): Promise<ServiceResult<Schedule[]>>;
  getScheduleById(id: number): Promise<ServiceResult<Schedule>>;
  createSchedule(data: createScheduleData): Promise<ServiceResult<Schedule>>;
  updateSchedule(
    id: number,
    data: updateScheduleData,
  ): Promise<ServiceResult<Schedule>>;
  deleteSchedule(id: number): Promise<ServiceResult<null>>;
  getScheduleStates(): Promise<ServiceResult<{ id: number; state: string }[]>>;
  createScheduleState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
  deleteScheduleState(id: number): Promise<ServiceResult<null>>;
  updateScheduleState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
}

export interface ScheduleController {
  getSchedules(req: Request, res: Response): Promise<void | Response>;
  getScheduleById(req: Request, res: Response): Promise<void | Response>;
  createSchedule(req: Request, res: Response): Promise<void | Response>;
  updateSchedule(req: Request, res: Response): Promise<void | Response>;
  deleteSchedule(req: Request, res: Response): Promise<void | Response>;
  getScheduleStates(req: Request, res: Response): Promise<void | Response>;
  createScheduleState(req: Request, res: Response): Promise<void | Response>;
  deleteScheduleState(req: Request, res: Response): Promise<void | Response>;
  updateScheduleState(req: Request, res: Response): Promise<void | Response>;
}
