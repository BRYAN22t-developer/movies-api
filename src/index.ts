import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./server.js";
import { MySQLAuthRepository } from "./repositories/auth.js";
import { DefaultAuthService } from "./services/auth.js";
import { HttpAuthController } from "./controllers/auth.js";
import { Auth as Authenticator } from "./middlewares/auth.js";
import { MySQLModel } from "./models/mysql/main.js";
import { MoviesController } from "./controllers/oldMovies.js";
import { UNAUTHENTICATED_ENDPOINTS } from "./constants/unauthenticated-endpoints.js";

const authRepository = new MySQLAuthRepository();
const authService = new DefaultAuthService(authRepository);
const authController = new HttpAuthController(authService);
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
