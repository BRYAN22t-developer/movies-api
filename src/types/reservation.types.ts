import type { Request, Response } from "express";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type Reservation = {
  startTime: string;
  startDate: string;
  room: string;
  movieTitle: string;
  state: string;
  user: string;
  seat: string;
};

export type CreateReservationData = {
  scheduleId: number;
  seatId: number;
  userId: number;
  stateId: number;
};

export type updateReservationData = Partial<CreateReservationData>;

export interface ReservationRepository {
  getReservations(): Promise<ServiceResult<Reservation[]>>;
  getReservationById(id: number): Promise<ServiceResult<Reservation>>;
  createReservation(
    data: CreateReservationData,
  ): Promise<ServiceResult<Reservation>>;
  updateReservation(
    id: number,
    data: updateReservationData,
  ): Promise<ServiceResult<Reservation>>;
  deleteReservation(id: number): Promise<ServiceResult<null>>;
  getReservationStates(): Promise<
    ServiceResult<{ id: number; state: string }[]>
  >;
  createReservationState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
  deleteReservationState(id: number): Promise<ServiceResult<null>>;
  updateReservationState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
  getReservationStateById(
    id: number,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
}

export interface ReservationService {
  getReservations(): Promise<ServiceResult<Reservation[]>>;
  getReservationById(id: number): Promise<ServiceResult<Reservation>>;
  createReservation(
    data: CreateReservationData,
  ): Promise<ServiceResult<Reservation>>;
  updateReservation(
    id: number,
    data: updateReservationData,
  ): Promise<ServiceResult<Reservation>>;
  deleteReservation(id: number): Promise<ServiceResult<null>>;
  getReservationStates(): Promise<
    ServiceResult<{ id: number; state: string }[]>
  >;
  getReservationStateById(
    id: number,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
  createReservationState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
  deleteReservationState(id: number): Promise<ServiceResult<null>>;
  updateReservationState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>>;
}

export interface ReservationController {
  getReservations(req: Request, res: Response): Promise<void | Response>;
  getReservationById(req: Request, res: Response): Promise<void | Response>;
  createReservation(req: Request, res: Response): Promise<void | Response>;
  updateReservation(req: Request, res: Response): Promise<void | Response>;
  deleteReservation(req: Request, res: Response): Promise<void | Response>;
  getReservationStates(req: Request, res: Response): Promise<void | Response>;
  createReservationState(req: Request, res: Response): Promise<void | Response>;
  deleteReservationState(req: Request, res: Response): Promise<void | Response>;
  updateReservationState(req: Request, res: Response): Promise<void | Response>;
  getReservationStateById(
    req: Request,
    res: Response,
  ): Promise<void | Response>;
}
