import type {
  CreateMovieData,
  Movie,
  MoviesFiltersData,
  MoviesRepository,
  MoviesService,
  ServiceResult,
  UpdateMovieData,
} from "../types/movies.types.js";

export class DefaultMoviesService implements MoviesService {
  private readonly moviesRepository: MoviesRepository;

  constructor(moviesRepository: MoviesRepository) {
    this.moviesRepository = moviesRepository;
  }

  getMovies(filters?: MoviesFiltersData): Promise<ServiceResult<Movie[]>> {
    return this.moviesRepository.getMovies(filters);
  }
  findById(id: number): Promise<ServiceResult<Movie | null>> {
    return this.moviesRepository.findById(id);
  }

  createMovie(data: CreateMovieData): Promise<ServiceResult<Movie>> {
    return this.moviesRepository.create(data);
  }
  deleteMovieById(id: number): Promise<ServiceResult<null>> {
    return this.moviesRepository.deleteById(id);
  }
  updateMovieById(
    id: number,
    data: UpdateMovieData,
  ): Promise<ServiceResult<Movie>> {
    return this.moviesRepository.updateById(id, data);
  }
}
