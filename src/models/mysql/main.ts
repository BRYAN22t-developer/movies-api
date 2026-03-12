import type { Pool, RowDataPacket } from "mysql2/promise";
import mysql2 from "mysql2/promise";

const DEFAULT_DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "",
    database: "movies",
};

export class MySQLModel {
    private pool: Pool;
    private getMoviesQuery = `
            SELECT 
                m.title, 
                m.description, 
                m.poster_url, 
                m.duration_minutes,
                JSON_ARRAYAGG(
                    g.genre
                ) AS genres
            FROM movies m
            JOIN movies_genres mg ON mg.movie_id = m.id
            JOIN genres g ON g.id = mg.genre_id
        `

    constructor() {
        this.pool = mysql2.createPool(DEFAULT_DB_CONFIG);
    }

    async getMovies({ genre, search }: { genre?: string, search?: string }) {
        let query = this.getMoviesQuery;

        const complement = "GROUP BY m.id;"

        const params: (string | number)[] = [];
        const whereClauses: string[] = [];

        if (genre) {
            whereClauses.push(` EXISTS (
                SELECT 1 FROM movies_genres mg
                JOIN genres g ON g.id = mg.genre_id
                WHERE mg.movie_id = m.id AND lower(g.genre) = lower(?)
            )`);
            params.push(genre);
        }

        if (search) {
            whereClauses.push(`
                m.title LIKE ? OR m.description LIKE ?
            `);
            params.push(`%${search}%`, `%${search}%`);
        }

        query += whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";
        query += complement;
        const [movies] = await this.pool.query(query, params);

        return movies;
    }

    async getMovieById({ id }: { id: number }) {
        const query = this.getMoviesQuery + " WHERE m.id = ? GROUP BY m.id;";
        const [movie] = await this.pool.query(query, [id]);
        return movie;
    }

    async createMovie({ title, description, poster_url, duration_minutes, genres }: { title: string, description: string, poster_url: string, duration_minutes: number, genres: string[] }) {
        const query = `
            INSERT INTO movies (title, description, poster_url, duration_minutes)
            VALUES (?, ?, ?, ?);
        `

        const [result] = await this.pool.query(query, [title, description, poster_url, duration_minutes]);
        const movieId = (result as any).insertId;

        const genresPlaceholder = genres.map(() => "?").join(", ");

        const [genreRows] = await this.pool.query<RowDataPacket[]>(
            `
                SELECT id 
                FROM genres 
                WHERE genre IN (${genresPlaceholder}) 
            `,
            genres
        )

        const values = genreRows.map((row) => [movieId, row.id])

        if (values.length > 0) {
            await this.pool.query(
                `
                    INSERT INTO movies_genres (movie_id, genre_id)
                    VALUES ?
                `,
                [values]
            );
        }

        const movie = await this.getMovieById({ id: movieId })
        return movie;
    }

    async getGenres() {
        const query = "SELECT genre FROM genres";
        const [genres] = await this.pool.query<RowDataPacket[]>(query)

        const genresParsed = genres.map((genre) => genre.genre)

        return genresParsed;
    }
}