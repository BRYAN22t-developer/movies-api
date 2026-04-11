import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./server.js";
import { MySQLAuthRepository } from "./repositories/auth.js";
import { DefaultAuthService } from "./services/auth.js";
import { HttpAuthController } from "./controllers/auth.js";
import { Auth as Authenticator } from "./middlewares/auth.js";
import { MySQLModel } from "./models/mysql/main.js";
import { UNAUTHENTICATED_ENDPOINTS } from "./constants/unauthenticated-endpoints.js";
import { DefaultMoviesController } from "./controllers/movies.js";
import { DefaultMoviesService } from "./services/movies.js";
import { MySQLMoviesRepository } from "./repositories/movies.js";
import { MovieSchema } from "./schemas/movies.js";
import { MySQLGenresRepository } from "./repositories/genres.js";
import { DefaultGenresService } from "./services/genres.js";
import { DefaultScheduleController } from "./controllers/schedule.js";
import { MySQLScheduleRepository } from "./repositories/schedule.js";
import { DefaultScheduleService } from "./services/schedule.js";
import { ScheduleSchema } from "./schemas/schedule.js";
import { MySQLReservationRepository } from "./repositories/reservation.js";
import { DefaultReservationController } from "./controllers/reservation.js";
import { DefaultReservationService } from "./services/reservation.js";

//#region Dependency Injection

const authRepository = new MySQLAuthRepository();
const authService = new DefaultAuthService(authRepository);
const authController = new HttpAuthController(authService);
const authenticator = new Authenticator(authService, UNAUTHENTICATED_ENDPOINTS);

const genresRepository = new MySQLGenresRepository();
const genresService = new DefaultGenresService(genresRepository);
const moviesRepository = new MySQLMoviesRepository();
const moviesService = new DefaultMoviesService(moviesRepository);
const movieSchema = new MovieSchema();
const moviesController = new DefaultMoviesController({
  moviesService,
  movieSchema,
  genresService,
});

const scheduleSchema = new ScheduleSchema();
const scheduleRepository = new MySQLScheduleRepository();
const scheduleService = new DefaultScheduleService(scheduleRepository);
const scheduleController = new DefaultScheduleController(
  scheduleService,
  scheduleSchema,
  moviesService,
);

const reservationRepository = new MySQLReservationRepository();
const reservationService = new DefaultReservationService(reservationRepository);
const reservationController = new DefaultReservationController(
  reservationService,
);

//#endregion

const port = Number(process.env.PORT) || 3000;

createServer({
  authenticator,
  authController,
  moviesController,
  scheduleController,
  reservationController,
}).listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
