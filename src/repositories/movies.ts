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
    const { query, params } = this.getMoviesQuery(filters);
    const [movies] = await this.pool.query<MovieRow[]>(query, params);
    return { ok: true, data: this.parseMovies(movies) };
  }

  async findById(id: number): Promise<ServiceResult<Movie | null>> {
    const { query } = this.findByIdQuery();
    const [movie] = await this.pool.query<MovieRow[]>(query, [id]);
    return { ok: true, data: this.parseMovies(movie)[0] ?? null };
  }

  async create(data: CreateMovieData): Promise<ServiceResult<Movie>> {
    if (!data.genreIds.length) {
      return { ok: false, error: "At least one genre is required" };
    }

    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const { query, params } = this.createMovieQuery(data);
      const [result] = await connection.query<mysql.ResultSetHeader>(
        query,
        params,
      );
      const movieId = result.insertId;

      const { query: genresQuery, params: genresParams } =
        this.assignGenresToMovieQuery(movieId, data.genreIds);

      await connection.query(genresQuery, genresParams);

      const [rows] = await connection.query<MovieRow[]>(
        this.findByIdQuery().query,
        [movieId],
      );

      const movie = this.parseMovies(rows)[0];

      if (!movie) {
        throw new Error("Failed to create movie");
      }

      await connection.commit();

      return { ok: true, data: movie };
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }

  async deleteById(id: number): Promise<ServiceResult<null>> {
    const query = "DELETE FROM movies where id = ?";
    const [result] = await this.pool.query(query, [id]);
    return { ok: true, data: null };
  }

  async updateById(
    id: number,
    data: UpdateMovieData,
  ): Promise<ServiceResult<Movie>> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const [existingRows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM movies WHERE id = ? LIMIT 1",
        [id],
      );

      if (!existingRows.length) {
        return { ok: false, error: "Movie not found" };
      }

      const updateQuery = this.updateMovieQuery(id, data);

      if (updateQuery) {
        await connection.query(updateQuery.query, updateQuery.params);
      }

      if (data.genreIds !== undefined) {
        if (!data.genreIds.length) {
          return { ok: false, error: "At least one genre is required" };
        }

        const uniqueGenreIds = [...new Set(data.genreIds)];

        await connection.query("DELETE FROM movies_genres WHERE movie_id = ?", [
          id,
        ]);

        const { query: genresQuery, params: genresParams } =
          this.assignGenresToMovieQuery(id, uniqueGenreIds);

        await connection.query(genresQuery, genresParams);
      }

      const [rows] = await connection.query<MovieRow[]>(
        this.findByIdQuery().query,
        [id],
      );

      const movie = this.parseMovies(rows)[0];

      if (!movie) {
        throw new Error("Failed to fetch updated movie");
      }

      await connection.commit();

      return { ok: true, data: movie };
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
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

  private createMovieQuery(data: CreateMovieData) {
    const { title, description, poster_url, duration_minutes } = data;
    const query = `
    INSERT INTO movies (title, description, poster_url, duration_minutes)
    VALUES (?, ?, ?, ?);
    `;
    const params = [title, description, poster_url, duration_minutes];
    return { query, params };
  }

  private assignGenresToMovieQuery(movieId: number, genreIds: number[]) {
    const query = `
    INSERT INTO movies_genres (movie_id, genre_id)
    VALUES ${genreIds.map(() => "(?, ?)").join(", ")};
    `;
    const params: number[] = [];
    genreIds.forEach((genreId) => {
      params.push(movieId, genreId);
    });
    return { query, params };
  }

  private updateMovieQuery(id: number, data: UpdateMovieData) {
    const fields: string[] = [];
    const params: (string | number)[] = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      params.push(data.title);
    }

    if (data.description !== undefined) {
      fields.push("description = ?");
      params.push(data.description);
    }

    if (data.poster_url !== undefined) {
      fields.push("poster_url = ?");
      params.push(data.poster_url);
    }

    if (data.duration_minutes !== undefined) {
      fields.push("duration_minutes = ?");
      params.push(data.duration_minutes);
    }

    if (!fields.length) {
      return null;
    }

    const query = `UPDATE movies SET ${fields.join(", ")} WHERE id = ?`;
    params.push(id);

    return { query, params };
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

  private getMoviesQuery(filters?: MoviesFiltersData) {
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
