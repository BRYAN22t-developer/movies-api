import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./server.js";
import { AuthRepository } from "./repositories/auth.js";
import { AuthService } from "./services/auth.js";
import { AuthController } from "./controllers/auth.js";
import { Auth as Authenticator } from "./middlewares/auth.js";
import { MySQLModel } from "./models/mysql/main.js";
import { MoviesController } from "./controllers/movies.js";
import { UNAUTHENTICATED_ENDPOINTS } from "./constants/unauthenticated-endpoints.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authenticator = new Authenticator(authService, UNAUTHENTICATED_ENDPOINTS);

const moviesModel = new MySQLModel();
const moviesController = new MoviesController(moviesModel);

const port = Number(process.env.PORT) || 3000;

createServer({ authenticator, authController, moviesController }).listen(
  port,
  () => {
    console.log(`Server is running on http://localhost:${port}`);
  },
);
