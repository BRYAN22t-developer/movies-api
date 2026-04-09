import type { Request, Response } from "express";
import type {
  ReservationController,
  ReservationService,
} from "../types/reservation.types.js";

export class DefaultReservationController implements ReservationController {
  private reservationService: ReservationService;
  constructor(reservationService: ReservationService) {
    this.reservationService = reservationService;
  }

  async getReservationStateById(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const serviceResult = await this.reservationService.getReservationStateById(
      Number(req.params.id),
    );
    if (serviceResult.ok) {
      return res.json(serviceResult.data);
    } else {
      return res.status(404).json({ error: serviceResult.error });
    }
  }

  async getReservations(req: Request, res: Response): Promise<void | Response> {
    const serviceResult = await this.reservationService.getReservations();
    if (serviceResult.ok) {
      return res.json(serviceResult.data);
    } else {
      return res.status(500).json({ error: serviceResult.error });
    }
  }

  async getReservationById(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const serviceResult = await this.reservationService.getReservationById(
      Number(req.params.id),
    );
    if (serviceResult.ok) {
      return res.json(serviceResult.data);
    } else {
      return res.status(404).json({ error: serviceResult.error });
    }
  }

  async createReservation(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }

  async updateReservation(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }

  async deleteReservation(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }

  async getReservationStates(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }

  async createReservationState(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }

  async deleteReservationState(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }

  async updateReservationState(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    throw new Error("Method not implemented.");
  }
}
