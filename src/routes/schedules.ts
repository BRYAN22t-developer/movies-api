import { Router } from "express";
import type { Authenticator } from "../types/auth.types.js";
import type { ScheduleController } from "../types/schedule.types.js";

export function createSchedulesRouter({
  authenticator,
  scheduleController,
}: {
  authenticator: Authenticator;
  scheduleController: ScheduleController;
}): Router {
  const router = Router();

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

  return router;
}
