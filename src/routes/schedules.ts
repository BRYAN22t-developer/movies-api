import { Router } from "express";
import type { Authenticator } from "../types/auth.types.js";
import type { ScheduleController } from "../types/schedule.types.js";
import type { ReservationController } from "../types/reservation.types.js";

export function createSchedulesRouter({
  authenticator,
  scheduleController,
  reservationController,
}: {
  authenticator: Authenticator;
  scheduleController: ScheduleController;
  reservationController: ReservationController;
}): Router {
  const router = Router();

  //#region Reservation routes

  router.get(
    "/reservations",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "reservations:read"),
    (req, res) => {
      reservationController.getReservations(req, res);
    },
  );

  router.get(
    "/reservations/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "reservations:read"),
    (req, res) => {
      reservationController.getReservationById(req, res);
    },
  );

  router.post(
    "/:id/reservations",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "reservations:create"),
    (req, res) => {
      reservationController.createReservation(req, res);
    },
  );

  router.patch(
    "/reservations/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "reservations:update"),
    (req, res) => {
      reservationController.updateReservation(req, res);
    },
  );

  router.delete(
    "/reservations/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "reservations:delete"),
    (req, res) => {
      reservationController.deleteReservation(req, res);
    },
  );

  //#endregion

  //#region Schedule state routes

  router.get(
    "/states",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:read"),
    (req, res) => {
      scheduleController.getScheduleStates(req, res);
    },
  );

  router.post(
    "/states",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:create"),
    (req, res) => {
      scheduleController.createScheduleState(req, res);
    },
  );

  router.delete(
    "/states/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:delete"),
    (req, res) => {
      scheduleController.deleteScheduleState(req, res);
    },
  );

  router.patch(
    "/states/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:update"),
    (req, res) => {
      scheduleController.updateScheduleState(req, res);
    },
  );

  //#endregion

  //#region Schedule routes

  router.get(
    "/",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:read"),
    (req, res) => {
      scheduleController.getSchedules(req, res);
    },
  );

  router.get(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:read"),
    (req, res) => {
      scheduleController.getScheduleById(req, res);
    },
  );

  router.post(
    "/",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:update"),
    (req, res) => {
      scheduleController.createSchedule(req, res);
    },
  );

  router.patch(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "schedules:update"),
    (req, res) => {
      scheduleController.updateSchedule(req, res);
    },
  );

  //#endregion

  return router;
}
