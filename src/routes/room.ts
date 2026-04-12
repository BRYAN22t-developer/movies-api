import type { RoomController } from "../types/rooms.types.js";
import type { Authenticator } from "../types/auth.types.js";
import { Router } from "express";

export function createRoomRouter({
  roomController,
  authenticator,
}: {
  roomController: RoomController;
  authenticator: Authenticator;
}): Router {
  const router = Router();

  router.get(
    "/seats",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:read"),
    (req, res) => roomController.getSeats(req, res),
  );

  router.get(
    "/seats/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:read"),
    (req, res) => roomController.getSeatById(req, res),
  );

  router.get(
    "/:id/seats",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:read"),
    (req, res) => roomController.getSeats(req, res),
  );

  router.post(
    "/:id/seats",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:update"),
    (req, res) => roomController.createSeat(req, res),
  );

  router.delete(
    "/seats/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:update"),
    (req, res) => roomController.deleteSeat(req, res),
  );

  router.patch(
    "/seats/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:update"),
    (req, res) => roomController.updateSeat(req, res),
  );

  router.get(
    "/",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:read"),
    (req, res) => roomController.getRooms(req, res),
  );

  router.post(
    "/",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:create"),
    (req, res) => roomController.createRoom(req, res),
  );

  router.get(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:read"),
    (req, res) => roomController.getRoomById(req, res),
  );

  router.delete(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:delete"),
    (req, res) => roomController.deleteRoom(req, res),
  );

  router.patch(
    "/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "rooms:update"),
    (req, res) => roomController.updateRoom(req, res),
  );

  return router;
}
