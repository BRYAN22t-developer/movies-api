import type { Request, Response } from "express";
import type { RoomController, RoomService } from "../types/rooms.types.js";

export class DefaultRoomController implements RoomController {
  private readonly roomService: RoomService;

  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }

  async getRooms(req: Request, res: Response): Promise<void | Response> {
    const includeSeats = req.query.includeSeats === "true";
    const result_1 = await this.roomService.getRooms({ includeSeats });
    if (result_1.ok) {
      res.json(result_1.data);
    } else {
      res.status(500).json({ error: result_1.error });
    }
  }

  async getRoomById(req: Request, res: Response): Promise<void | Response> {
    const roomId = Number(req.params.roomId);
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
    const roomId = Number(req.params.roomId);
    const result = await this.roomService.deleteRoom(roomId);
    if (result.ok) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async updateRoom(req: Request, res: Response): Promise<void | Response> {
    const roomId = Number(req.params.roomId);
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
    const seatId = Number(req.params.seatId);
    const result = await this.roomService.getSeatById(seatId);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async createSeat(req: Request, res: Response): Promise<void | Response> {
    const data = req.body;
    const result = await this.roomService.createSeat(data);
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
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async updateSeat(req: Request, res: Response): Promise<void | Response> {
    const seatId = Number(req.params.seatId);
    const data = req.body;
    const result = await this.roomService.updateSeat(seatId, data);
    if (result.ok) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  }
}
