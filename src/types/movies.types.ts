import type { Request, Response } from "express";

export type MoviesFiltersData = {
  genreIds?: number[];
  search?: string;
  limit?: number;
  offset?: number;
};

export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  duration_minutes: number;
  genres: string[];
}

export type CreateMovieData = {
  title: string;
  description: string;
  poster_url: string;
  duration_minutes: number;
  genreIds: number[];
};

export type UpdateMovieData = Partial<CreateMovieData>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface MoviesRepository {
  getMovies(filters?: MoviesFiltersData): Promise<ServiceResult<Movie[]>>;
  findById(id: number): Promise<ServiceResult<Movie | null>>;
  create(data: CreateMovieData): Promise<ServiceResult<Movie>>;
  deleteById(id: number): Promise<ServiceResult<null>>;
  updateById(id: number, data: UpdateMovieData): Promise<ServiceResult<Movie>>;
}

export interface Genre {
  id: number;
  name: string;
}

export type CreateGenreData = {
  name: string;
};

export type UpdateGenreData = Partial<CreateGenreData>;

export interface GenresRepository {
  getGenres(): Promise<ServiceResult<Genre[]>>;
  create(data: CreateGenreData): Promise<ServiceResult<Genre>>;
  findById(id: number): Promise<ServiceResult<Genre | null>>;
  findByIds(ids: number[]): Promise<ServiceResult<Genre[] | null>>;
  findByName(name: string): Promise<ServiceResult<Genre | null>>;
  findByNames(names: string[]): Promise<ServiceResult<Genre[] | null>>;
  deleteById(id: number): Promise<ServiceResult<null>>;
  updateById(id: number, data: UpdateGenreData): Promise<ServiceResult<Genre>>;
}

export interface MoviesService {
  getMovies(filters?: MoviesFiltersData): Promise<ServiceResult<Movie[]>>;
  findById(id: number): Promise<ServiceResult<Movie | null>>;
  createMovie(data: CreateMovieData): Promise<ServiceResult<Movie>>;
  deleteMovieById(id: number): Promise<ServiceResult<null>>;
  updateMovieById(
    id: number,
    data: UpdateMovieData,
  ): Promise<ServiceResult<Movie>>;
}

export interface GenresService {
  getGenres(): Promise<ServiceResult<Genre[]>>;
  createGenre(data: CreateGenreData): Promise<ServiceResult<Genre>>;
  findGenreById(id: number): Promise<ServiceResult<Genre | null>>;
  findGenreByIds(ids: number[]): Promise<ServiceResult<Genre[] | null>>;
  findGenreByName(name: string): Promise<ServiceResult<Genre | null>>;
  findGenreByNames(names: string[]): Promise<ServiceResult<Genre[] | null>>;
  deleteGenreById(id: number): Promise<ServiceResult<null>>;
  updateGenreById(
    id: number,
    data: UpdateGenreData,
  ): Promise<ServiceResult<Genre>>;
}

export interface MoviesController {
  getMovies(req: Request, res: Response): Promise<void | Response>;
  getMovieById(req: Request, res: Response): Promise<void | Response>;
  createMovie(req: Request, res: Response): Promise<void | Response>;
  deleteMovieById(req: Request, res: Response): Promise<void | Response>;
  updateMovieById(req: Request, res: Response): Promise<void | Response>;
  deleteGenreById(req: Request, res: Response): Promise<void | Response>;
  updateGenreById(req: Request, res: Response): Promise<void | Response>;
  getGenres(req: Request, res: Response): Promise<void | Response>;
  createGenre(req: Request, res: Response): Promise<void | Response>;
}
