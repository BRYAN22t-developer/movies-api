import type { MovieSchema } from "../schemas/movies.js";
import type {
  GenresService,
  MoviesController,
  MoviesFiltersData,
  MoviesService,
  UpdateMovieData,
} from "../types/movies.types.js";
import type { Request, Response } from "express";

export class DefaultMoviesController implements MoviesController {
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

  async getGenres(req: Request, res: Response): Promise<void | Response> {
    const result = await this.genresService.getGenres();
    if (!result.ok) {
      return res.status(500).json({ error: result.error });
    }
    return res.json(result.data);
  }

  async createGenre(req: Request, res: Response): Promise<void | Response> {
    const result = await this.movieSchema.validateCreateGenre(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const data = result.data;
    const genre = await this.genresService.createGenre(data);
    if (!genre.ok) {
      return res.status(500).json({ error: genre.error });
    }
    return res.status(201).json(genre.data);
  }

  async deleteGenreById(req: Request, res: Response): Promise<void | Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid genre ID" });
    }
    const result = await this.genresService.deleteGenreById(id);
    if (!result.ok) {
      return res.status(500).json({ error: result.error });
    }
    return res.status(204).send();
  }

  async updateGenreById(req: Request, res: Response): Promise<void | Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid genre ID" });
    }
    const result = await this.genresService.updateGenreById(id, req.body);
    if (!result.ok) {
      return res.status(500).json({ error: result.error });
    }
    return res.json(result.data);
  }

  async getMovies(req: Request, res: Response): Promise<void | Response> {
    const result = await this.movieSchema.validateFilters(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const filters = result.data as MoviesFiltersData;
    const movies = await this.moviesService.getMovies(filters);
    res.json(movies);
  }

  async getMovieById(req: Request, res: Response): Promise<void | Response> {
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

  async createMovie(req: Request, res: Response): Promise<void | Response> {
    const { genres } = req.body;

    const genresResult = await this.genresService.findGenreByNames(genres);
    if (!genresResult.ok) {
      return res.status(500).json({ error: genresResult.error });
    }

    const genreIds = genresResult.data?.map((genre) => genre.id) ?? [];

    const result = await this.movieSchema.validateCreate({
      ...req.body,
      genreIds,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const data = result.data;

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

  async deleteMovieById(req: Request, res: Response): Promise<void | Response> {
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

  async updateMovieById(req: Request, res: Response): Promise<void | Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const { genres } = req.body;

    const genresResult = genres
      ? await this.genresService.findGenreByNames(genres)
      : null;
    if (!genresResult?.ok) {
      return res
        .status(500)
        .json({ error: genresResult?.error || "Failed to find genres" });
    }

    const genreIds = genresResult.data?.map((genre) => genre.id) ?? [];

    const result = await this.movieSchema.validatePartialCreate({
      ...req.body,
      genreIds,
    });
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
