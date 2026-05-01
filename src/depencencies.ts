import { getPool } from "./db/mysql.js";

import { MySQLAuthRepository } from "./repositories/auth.js";
import { DefaultAuthService } from "./services/auth.js";
import { HttpAuthController } from "./controllers/auth.js";
import { Auth as Authenticator } from "./middlewares/auth.js";
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

import { DefaultRoomController } from "./controllers/room.js";
import { MySQLRoomRepository } from "./repositories/room.js";
import { DefaultRoomService } from "./services/room.js";

export function createDependencies() {
  const pool = getPool();

  const authRepository = new MySQLAuthRepository(pool);
  const authService = new DefaultAuthService(authRepository);
  const authController = new HttpAuthController(authService);
  const authenticator = new Authenticator(
    authService,
    UNAUTHENTICATED_ENDPOINTS,
  );

  const genresRepository = new MySQLGenresRepository(pool);
  const genresService = new DefaultGenresService(genresRepository);

  const moviesRepository = new MySQLMoviesRepository(pool);
  const moviesService = new DefaultMoviesService(moviesRepository);
  const movieSchema = new MovieSchema();
  const moviesController = new DefaultMoviesController({
    moviesService,
    movieSchema,
    genresService,
  });

  const scheduleSchema = new ScheduleSchema();
  const scheduleRepository = new MySQLScheduleRepository(pool);
  const scheduleService = new DefaultScheduleService(scheduleRepository);
  const scheduleController = new DefaultScheduleController(
    scheduleService,
    scheduleSchema,
    moviesService,
  );

  const reservationRepository = new MySQLReservationRepository(pool);
  const reservationService = new DefaultReservationService(
    reservationRepository,
  );
  const reservationController = new DefaultReservationController(
    reservationService,
  );

  const roomRepository = new MySQLRoomRepository(pool);
  const roomService = new DefaultRoomService(roomRepository);
  const roomController = new DefaultRoomController(roomService);

  return {
    authenticator,
    authController,
    moviesController,
    scheduleController,
    reservationController,
    roomController,
  };
}
