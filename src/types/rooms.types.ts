import type { Request, Response } from "express";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type Room = {
  id: number;
  name: string;
};

export type Seat = {
  id: number;
  roomId: number;
  row: string;
  column: number;
};

export type CreateSeatData = {
  roomId: number;
  row: string;
  column: number;
};

export type UpdateSeatData = Partial<CreateSeatData>;

export type GetSeatsFilters = {
  filterByRoomId?: number;
};

export type GetRoomsFilters = {
  includeSeats?: boolean;
};

export interface RoomRepository {
  getRooms(filters?: GetRoomsFilters): Promise<ServiceResult<Room[]>>;
  getRoomById(id: number): Promise<ServiceResult<Room>>;
  createRoom(name: string): Promise<ServiceResult<Room>>;
  deleteRoom(id: number): Promise<ServiceResult<null>>;
  updateRoom(id: number, name: string): Promise<ServiceResult<Room>>;
  getSeats(filters?: GetSeatsFilters): Promise<ServiceResult<Seat[]>>;
  getSeatById(id: number): Promise<ServiceResult<Seat>>;
  createSeat(data: CreateSeatData): Promise<ServiceResult<Seat>>;
  deleteSeat(id: number): Promise<ServiceResult<null>>;
  updateSeat(id: number, data: UpdateSeatData): Promise<ServiceResult<Seat>>;
}

export interface RoomService {
  getRooms(filters?: GetRoomsFilters): Promise<ServiceResult<Room[]>>;
  getRoomById(id: number): Promise<ServiceResult<Room>>;
  createRoom(name: string): Promise<ServiceResult<Room>>;
  deleteRoom(id: number): Promise<ServiceResult<null>>;
  updateRoom(id: number, name: string): Promise<ServiceResult<Room>>;
  getSeats(filters?: GetSeatsFilters): Promise<ServiceResult<Seat[]>>;
  getSeatById(id: number): Promise<ServiceResult<Seat>>;
  createSeat(data: CreateSeatData): Promise<ServiceResult<Seat>>;
  deleteSeat(id: number): Promise<ServiceResult<null>>;
  updateSeat(id: number, data: UpdateSeatData): Promise<ServiceResult<Seat>>;
}

export interface RoomController {
  getRooms(req: Request, res: Response): Promise<void | Response>;
  getRoomById(req: Request, res: Response): Promise<void | Response>;
  createRoom(req: Request, res: Response): Promise<void | Response>;
  deleteRoom(req: Request, res: Response): Promise<void | Response>;
  updateRoom(req: Request, res: Response): Promise<void | Response>;
  getSeats(req: Request, res: Response): Promise<void | Response>;
  getSeatById(req: Request, res: Response): Promise<void | Response>;
  createSeat(req: Request, res: Response): Promise<void | Response>;
  deleteSeat(req: Request, res: Response): Promise<void | Response>;
  updateSeat(req: Request, res: Response): Promise<void | Response>;
}
