import mysql2 from "mysql2/promise";

const DEFAULT_DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "",
    database: "movies",
};

export class MySQLModel {
    private pool: any;

    constructor() {
        this.pool = mysql2.createPool(DEFAULT_DB_CONFIG);
    }

    async getMovies() {
        const query = `
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
            GROUP BY m.id;
        `

        const [movies] = await this.pool.query(query);

        return movies;
    }
}