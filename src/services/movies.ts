import type {
  CreateMovieData,
  Movie,
  MoviesFiltersData,
  MoviesService,
  ServiceResult,
  UpdateMovieData,
} from "../types/movies.types.js";

export class DefaultMoviesService implements MoviesService {
  private readonly moviesRepository: MoviesService;

  constructor(moviesRepository: MoviesService) {
    this.moviesRepository = moviesRepository;
  }

  getMovies(filters?: MoviesFiltersData): Promise<ServiceResult<Movie[]>> {
    return this.moviesRepository.getMovies(filters);
  }
  findById(id: number): Promise<ServiceResult<Movie | null>> {
    return this.moviesRepository.findById(id);
  }

  createMovie(data: CreateMovieData): Promise<ServiceResult<Movie>> {
    return this.moviesRepository.createMovie(data);
  }
  deleteMovieById(id: number): Promise<ServiceResult<null>> {
    return this.moviesRepository.deleteMovieById(id);
  }
  updateMovieById(
    id: number,
    data: UpdateMovieData,
  ): Promise<ServiceResult<Movie>> {
    return this.moviesRepository.updateMovieById(id, data);
  }
}
