import type { Request, Response } from "express";
import type { RoomController, RoomService } from "../types/rooms.types.js";

export class DefaultRoomController implements RoomController {
  private readonly roomService: RoomService;

  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }

  async getRooms(req: Request, res: Response): Promise<void | Response> {
    const includeSeats = req.query.includeSeats === "true";
    const result = await this.roomService.getRooms({ includeSeats });
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async getRoomById(req: Request, res: Response): Promise<void | Response> {
    const roomId = Number(req.params.id);
    const result = await this.roomService.getRoomById(roomId);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async createRoom(req: Request, res: Response): Promise<void | Response> {
    const { name } = req.body;
    const result = await this.roomService.createRoom(name);
    if (result.ok) {
      res.status(201).json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async deleteRoom(req: Request, res: Response): Promise<void | Response> {
    const roomId = Number(req.params.id);
    const result = await this.roomService.deleteRoom(roomId);
    if (result.ok) {
      res.status(200).json({ message: "Room deleted successfully" });
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async updateRoom(req: Request, res: Response): Promise<void | Response> {
    const roomId = Number(req.params.id);
    const { name } = req.body;
    const result = await this.roomService.updateRoom(roomId, name);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async getSeats(req: Request, res: Response): Promise<void | Response> {
    const filters = {};
    const result = await this.roomService.getSeats(filters);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async getSeatById(req: Request, res: Response): Promise<void | Response> {
    const id = Number(req.params.id);
    const result = await this.roomService.getSeatById(id);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async createSeat(req: Request, res: Response): Promise<void | Response> {
    const roomId = Number(req.params.id);
    const { row, column } = req.body;
    const result = await this.roomService.createSeat({
      roomId,
      row,
      column: Number(column),
    });
    if (result.ok) {
      res.status(201).json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async deleteSeat(req: Request, res: Response): Promise<void | Response> {
    const seatId = Number(req.params.seatId);
    const result = await this.roomService.deleteSeat(seatId);
    if (result.ok) {
      res.status(200).json({ message: "Seat deleted successfully" });
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async updateSeat(req: Request, res: Response): Promise<void | Response> {
    const id = Number(req.params.id);
    const data = req.body;
    const result = await this.roomService.updateSeat(id, data);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }
}
