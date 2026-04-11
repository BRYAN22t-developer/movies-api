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

  async getReservationsByScheduleId(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const scheduleId = Number(req.params.id);
    const serviceResult = await this.reservationService.getReservations({
      scheduleId,
    });
    if (serviceResult.ok) {
      return res.json(serviceResult.data);
    } else {
      return res.status(500).json({ error: serviceResult.error });
    }
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
    const scheduleId = req.params.id;
    const userId = (req.user as Express.UserPayload).id;
    const { seatId, stateId } = req.body;
    const serviceResult = await this.reservationService.createReservation({
      scheduleId: Number(scheduleId),
      userId: Number(userId),
      seatId: Number(seatId),
      stateId: Number(stateId),
    });
    if (serviceResult.ok) {
      return res.status(201).json(serviceResult.data);
    } else {
      return res.status(400).json({ error: serviceResult.error });
    }
  }

  async updateReservation(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const scheduleId = req.params.id;
    const userId = (req.user as Express.UserPayload).id;
    const { seatId, stateId } = req.body;
    const serviceResult = await this.reservationService.updateReservation(
      Number(scheduleId),
      {
        userId: Number(userId),
        seatId: seatId ? Number(seatId) : undefined,
        stateId: stateId ? Number(stateId) : undefined,
      },
    );
    if (serviceResult.ok) {
      return res.json(serviceResult.data);
    } else {
      return res.status(400).json({ error: serviceResult.error });
    }
  }

  async deleteReservation(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const serviceResult = await this.reservationService.deleteReservation(
      Number(req.params.id),
    );
    if (serviceResult.ok) {
      return res.json({ message: "Reservation deleted successfully" });
    } else {
      return res.status(404).json({ error: serviceResult.error });
    }
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
