import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type {
  CreateGenreData,
  Genre,
  GenresRepository,
  ServiceResult,
  UpdateGenreData,
} from "../types/movies.types.js";

type GenreRow = RowDataPacket & {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  duration_minutes: number;
  genres: string[];
};

export class MySQLGenresRepository implements GenresRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getGenres(): Promise<ServiceResult<Genre[]>> {
    const query = "SELECT id, genre FROM genres";
    const [rows] = await this.pool.query<GenreRow[]>(query);
    return { ok: true, data: this.parseGenres(rows) };
  }

  async create(data: CreateGenreData): Promise<ServiceResult<Genre>> {
    const query = "INSERT INTO genres (genre) VALUES (?)";
    const [result] = await this.pool.query<ResultSetHeader>(query, [data.name]);
    const genreId = result.insertId;
    const [rows] = await this.pool.query<GenreRow[]>(
      `SELECT id, genre FROM genres WHERE id = ?`,
      [genreId],
    );

    if (!rows || rows.length === 0) {
      return { ok: false, error: "Failed to create genre" };
    }

    const genre = this.parseGenres(rows)[0];

    if (!genre) {
      return { ok: false, error: "Failed to parse created genre" };
    }

    return { ok: true, data: genre };
  }

  async findById(id: number): Promise<ServiceResult<Genre | null>> {
    const query = "SELECT id, genre FROM genres WHERE id = ?";
    const [rows] = await this.pool.query<GenreRow[]>(query, [id]);
    const genre = this.parseGenres(rows)[0] ?? null;
    return { ok: true, data: genre };
  }

  async findByIds(ids: number[]): Promise<ServiceResult<Genre[] | null>> {
    const placeholders = ids.map(() => "?").join(", ");
    const query = `SELECT id, genre FROM genres WHERE id IN (${placeholders})`;
    const [rows] = await this.pool.query<GenreRow[]>(query, ids);
    return { ok: true, data: this.parseGenres(rows) };
  }

  async findByName(name: string): Promise<ServiceResult<Genre | null>> {
    const query = "SELECT id, genre FROM genres WHERE genre = ?";
    const [rows] = await this.pool.query<GenreRow[]>(query, [name]);
    const genre = this.parseGenres(rows)[0] ?? null;
    return { ok: true, data: genre };
  }

  async findByNames(names: string[]): Promise<ServiceResult<Genre[] | null>> {
    const placeholders = names.map(() => "?").join(", ");
    const query = `SELECT id, genre FROM genres WHERE genre IN (${placeholders})`;
    const [rows] = await this.pool.query<GenreRow[]>(query, names);
    return { ok: true, data: this.parseGenres(rows) };
  }

  async deleteById(id: number): Promise<ServiceResult<null>> {
    const query = "DELETE FROM genres WHERE id = ?";
    const [result] = await this.pool.query(query, [id]);
    return { ok: true, data: null };
  }

  async updateById(
    id: number,
    data: UpdateGenreData,
  ): Promise<ServiceResult<Genre>> {
    const query = "UPDATE genres SET genre = ? WHERE id = ?";
    const [result] = await this.pool.query(query, [data.name, id]);
    const [rows] = await this.pool.query<GenreRow[]>(
      `SELECT id, genre FROM genres WHERE id = ?`,
      [id],
    );
    const genre = this.parseGenres(rows)[0];
    if (!genre) {
      return { ok: false, error: "Failed to update genre" };
    }
    return { ok: true, data: genre };
  }

  //#region Private and helpers methods
  private parseGenre(row: GenreRow): Genre {
    return {
      id: row.id,
      name: row.title,
    };
  }

  private parseGenres(rows: GenreRow[]): Genre[] {
    return rows.map(this.parseGenre);
  }

  //#endregion
}
