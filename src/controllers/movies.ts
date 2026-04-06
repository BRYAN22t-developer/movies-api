import type { MovieSchema } from "../schemas/movies.js";
import type {
  GenresService,
  MoviesFiltersData,
  MoviesService,
  UpdateMovieData,
} from "../types/movies.types.js";
import type { Request, Response } from "express";

export class DefaultMoviesController {
  private readonly moviesService: MoviesService;
  private readonly movieSchema: MovieSchema;
  private readonly genresService: GenresService;

  constructor({
    moviesService,
    movieSchema,
    genresService,
  }: {
    moviesService: MoviesService;
    movieSchema: MovieSchema;
    genresService: GenresService;
  }) {
    this.moviesService = moviesService;
    this.movieSchema = movieSchema;
    this.genresService = genresService;
  }

  async getMovies(req: Request, res: Response) {
    const result = await this.movieSchema.validateFilters(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const filters = result.data as MoviesFiltersData;
    const movies = await this.moviesService.getMovies(filters);
    res.json(movies);
  }

  async getMovieById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    const movie = await this.moviesService.findById(id);
    if (!movie.ok) {
      return res.status(500).json({ error: movie.error });
    }
    if (!movie.data) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie.data);
  }

  async createMovie(req: Request, res: Response) {
    const result = await this.movieSchema.validateCreate(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const data = result.data;

    const genresResult = await this.genresService.findGenreByIds(data.genreIds);
    if (!genresResult.ok) {
      return res.status(500).json({ error: genresResult.error });
    }
    if (
      !genresResult.data ||
      genresResult.data.length !== data.genreIds.length
    ) {
      return res.status(400).json({ error: "One or more genres not found" });
    }

    const movie = await this.moviesService.createMovie(data);
    if (!movie.ok) {
      return res.status(500).json({ error: movie.error });
    }
    res.status(201).json(movie.data);
  }

  async deleteMovieById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    const result = await this.moviesService.deleteMovieById(id);
    if (!result.ok) {
      return res.status(500).json({ error: result.error });
    }
    res.status(204).send();
  }

  async updateMovieById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    const result = await this.movieSchema.validatePartialCreate(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const data = result.data;
    const movie = await this.moviesService.updateMovieById(
      id,
      data as UpdateMovieData,
    );
    if (!movie.ok) {
      return res.status(500).json({ error: movie.error });
    }
    res.json(movie.data);
  }
}
