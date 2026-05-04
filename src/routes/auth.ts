import { Router } from "express";
import type { AuthController, Authenticator } from "../types/auth.types.js";

export function createAuthRouter({
  authenticator,
  authController,
}: {
  authenticator: Authenticator;
  authController: AuthController;
}): Router {
  const router = Router();

  router.post(
    "/register",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "users:create"),
    (req, res) => {
      authController.register(req, res);
    },
  );

  router.post("/login", (req, res) => {
    authController.login(req, res);
  });

  router.get(
    "/users/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "users:read"),
    (req, res) => {
      authController.getUser(req, res);
    },
  );

  router.delete(
    "/users/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "users:delete"),
    (req, res) => {
      authController.deleteUser(req, res);
    },
  );

  router.put(
    "/users/:id/password",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "users:update"),
    (req, res) => {
      authController.updatePassword(req, res);
    },
  );

  router.put(
    "/users/:id",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "users:update"),
    (req, res) => {
      authController.updateUser(req, res);
    },
  );

  router.get(
    "/users/role/:roleName",
    (req, res, next) =>
      authenticator.authorization(req, res, next, "users:read"),
    (req, res) => {
      authController.getUsersWithRole(req, res);
    },
  );

  return router;
}
