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

    //#region movies and genres

    async getMovies({ genre, search, limit, offset }: { genre?: string, search?: string, limit?: number, offset?: number }) {
        let query = this.getMoviesQuery;

        const complement: string[] = ["GROUP BY m.id"]

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

        if(limit){
            complement.push("LIMIT ?")
            params.push(limit)
        }

        if(offset){
            complement.push("OFFSET ?")
            params.push(offset)
        }

        query += whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";
        query += complement.join(" ");
        const [movies] = await this.pool.query(query, params);

        return movies;
    }

    async getMovieById({ id }: { id: number }) {
        const query = this.getMoviesQuery + " WHERE m.id = ? GROUP BY m.id;";
        const [movie] = await this.pool.query(query, [id]);
        return movie;
    }

    async createMovie({ title, description, poster_url, duration_minutes, genres }: { title: string, description: string, poster_url: string, duration_minutes: number, genres: string[] }) {
        const titleAlreadyExists = async () => {
            const query = "SELECT 1 FROM movies WHERE lower(title) = lower(?)"
            const [result] = await this.pool.query(query, [title])
            return (result as any)[0] !== undefined
        }

        const genresExists = async () => {
            const placeholder = genres.map(() => "?").join(", ")
            const query = `SELECT genre FROM genres WHERE genre IN (${placeholder})`
            const [result] = await this.pool.query(query, genres)
            return (result as any).length === genres.length
        }

        if (!await genresExists()) {
            return { "error": "genres do not match those in the database" }
        }

        if (await titleAlreadyExists()) {
            return { "error": "title already exists" }
        }

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

    async deleteMovie({ id }: { id: number }) {
        const query = "DELETE FROM movies where id = ?"
        const [result] = await this.pool.query(query, [id])
        return result
    }

    async getGenres() {
        const query = "SELECT genre FROM genres";
        const [genres] = await this.pool.query<RowDataPacket[]>(query)

        const genresParsed = genres.map((genre) => genre.genre)

        return genresParsed;
    }

    async createGenre({ genre }: { genre: string }) {
        const genreAlreadyExists = async () => {
            const query = "SELECT 1 FROM genres WHERE lower(genre) = lower(?)"
            const [result] = await this.pool.query(query, [genre])
            return (result as any)[0] !== undefined
        }

        if (await genreAlreadyExists()) {
            return { "error": "genre already exists" }
        }

        const query = "INSERT INTO genres (genre) VALUES (?)";

        let newGenre;

        try {
            const [result] = await this.pool.query(query, [genre])
            newGenre = result;
        } catch (e) {
            return { "error": e }
        }

        const newGenreId = (newGenre as any).insertId
        const [result] = await this.pool.query("SELECT genre FROM genres WHERE id = ?", [newGenreId])


        return result
    }

    async removeGenre({ id }: { id: number }) {
        const query = "DELETE FROM genres WHERE id = ?"
        await this.pool.query(query, [id])
        return { "message": "genre deleted succesfully" }
    }

    async updateMovie({ id, title, description, poster_url, duration_minutes, genres }: { id: number, title?: string, description?: string, poster_url?: string, duration_minutes?: number, genres?: string[] }) {
        const fields: string[] = []
        const values: (string | number)[] = []

        if (title) {
            fields.push("title = ?")
            values.push(title)
        }

        if (description) {
            fields.push("description = ?")
            values.push(description)
        }

        if (poster_url) {
            fields.push("poster_url = ?")
            values.push(poster_url)
        }

        if (duration_minutes !== undefined) {
            fields.push("duration_minutes = ?")
            values.push(duration_minutes)
        }

        

        const assignGenres = async (movieId: number, genres: string[]) => {
            await this.pool.query("DELETE FROM movies_genres WHERE movie_id = ?", [movieId])
            const genresPlaceholder = genres.map(() => "?").join(", ")
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

        }

        if(genres){
            assignGenres(id, genres)
        }

        if (fields.length === 0) {
            return genres !== undefined
        }

        values.push(id)

        const query = `
            UPDATE movies 
            SET ${fields.join(", ")} 
            WHERE id = ?
        `
        await this.pool.query(query, values)

        const updatedMovie = await this.getMovieById({ id })
        return updatedMovie
    }

    //#endregion

    async getScheduleStates() {
        const query = "SELECT state FROM schedules_states"
        const [states] = await this.pool.query<RowDataPacket[]>(query)
        const parsedStates = states.map((state) => state.state)
        return parsedStates
    }

    async createScheduleState({ state }: { state: string }) {
        const query = "INSERT INTO schedules_states (state) VALUES (?)"
        const [newState] = await this.pool.query(query, [state])

        const newStateId = (newState as any).insertId
        const [result] = await this.pool.query("SELECT state FROM schedules_states WHERE id = ?", [newStateId])
        return result
    }

    async deleteScheduleState({ id }: { id: number }) {
        const query = "DELETE FROM schedules_states WHERE id = ?"
        const [result] = await this.pool.query(query, [id])
        return result
    }

    async updateScheduleState({id, state}: {id: number, state: string}){
        const query = "UPDATE schedules_states SET state = ? WHERE id = ?"
        await this.pool.query(query, [state, id])
        const [result] = await this.pool.query("SELECT state FROM schedules_states WHERE id = ?", [id])
        return result
    }
}