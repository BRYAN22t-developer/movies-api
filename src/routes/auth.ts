import { Router } from "express";
import type {
  AuthControllerContract,
  AuthenticatorContract,
} from "../types/auth.types.js";

export function createAuthRouter({
  authenticator,
  authController,
}: {
  authenticator: AuthenticatorContract;
  authController: AuthControllerContract;
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

  return router;
}
