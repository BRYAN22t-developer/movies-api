import type {
  CreateMovieData,
  Movie,
  MoviesFiltersData,
  MoviesRepository,
  ServiceResult,
  UpdateMovieData,
} from "../types/movies.types.js";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

type MovieRow = RowDataPacket & {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  duration_minutes: number;
  genres: string[];
};

export class MySQLMoviesRepository implements MoviesRepository {
  private readonly pool: Pool;

  constructor() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) throw new Error("DATABASE_URL is not defined");
    this.pool = mysql.createPool(DATABASE_URL);
  }

  async getMovies(
    filters?: MoviesFiltersData,
  ): Promise<ServiceResult<Movie[]>> {
    const { query, params } = this.getMovieQuery(filters);
    const [movies] = await this.pool.query<MovieRow[]>(query, params);
    return { ok: true, data: this.parseMovies(movies) };
  }

  async findById(id: number): Promise<ServiceResult<Movie | null>> {
    const { query } = this.findByIdQuery();
    const [movie] = await this.pool.query<MovieRow[]>(query, [id]);
    return { ok: true, data: this.parseMovies(movie)[0] ?? null };
  }

  async create(data: CreateMovieData): Promise<ServiceResult<Movie>> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: number): Promise<ServiceResult<null>> {
    const query = "DELETE FROM movies where id = ?";
    const [result] = await this.pool.query(query, [id]);
    return { ok: true, data: null };
  }

  updateById(id: number, data: UpdateMovieData): Promise<ServiceResult<Movie>> {
    throw new Error("Method not implemented.");
  }

  //#region PRIVATE AND HELPERS METHODS

  private parseMovie(row: MovieRow): Movie {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      poster_url: row.poster_url,
      duration_minutes: row.duration_minutes,
      genres: Array.isArray(row.genres) ? row.genres : JSON.parse(row.genres),
    };
  }

  private parseMovies(rows: MovieRow[]): Movie[] {
    return rows.map((row) => this.parseMovie(row));
  }

  private findByIdQuery() {
    const query = `
    SELECT 
      m.id,
      m.title,
      m.description,
      m.poster_url,
      m.duration_minutes,
      JSON_ARRAYAGG(g.genre) AS genres
    FROM movies m
    JOIN movies_genres mg ON mg.movie_id = m.id
    JOIN genres g ON g.id = mg.genre_id
    WHERE m.id = ? GROUP BY m.id;
    `;
    return { query };
  }

  private getMovieQuery(filters?: MoviesFiltersData) {
    let query = `
    SELECT 
      m.id,
      m.title,
      m.description,
      m.poster_url,
      m.duration_minutes,
      JSON_ARRAYAGG(g.genre) AS genres
    FROM movies m
    JOIN movies_genres mg ON mg.movie_id = m.id
    JOIN genres g ON g.id = mg.genre_id
  `;

    const params: (string | number)[] = [];
    const whereClauses: string[] = [];
    const complement: string[] = ["GROUP BY m.id"];

    if (filters?.search) {
      whereClauses.push(`(m.title LIKE ? OR m.description LIKE ?)`);
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters?.genreIds?.length) {
      const placeholders = filters.genreIds.map(() => "?").join(", ");
      whereClauses.push(`
      EXISTS (
        SELECT 1
        FROM movies_genres mg2
        WHERE mg2.movie_id = m.id
          AND mg2.genre_id IN (${placeholders})
      )
    `);
      params.push(...filters.genreIds);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    if (filters?.limit != null) {
      complement.push("LIMIT ?");
      params.push(filters.limit);
    }

    if (filters?.offset != null) {
      complement.push("OFFSET ?");
      params.push(filters.offset);
    }

    query += ` ${complement.join(" ")}`;

    return { query, params };
  }

  //#endregion
}
