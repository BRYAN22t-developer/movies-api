import type { Pool, RowDataPacket } from "mysql2/promise";
import mysql2 from "mysql2/promise";

const DEFAULT_DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "movies",
  dateStrings: true,
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
        `;

  constructor() {
    this.pool = mysql2.createPool(DEFAULT_DB_CONFIG);
  }

  //#region schedules

  async getScheduleStates() {
    const query = "SELECT state FROM schedules_states";
    const [states] = await this.pool.query<RowDataPacket[]>(query);
    const parsedStates = states.map((state) => state.state);
    return parsedStates;
  }

  async createScheduleState({ state }: { state: string }) {
    const query = "INSERT INTO schedules_states (state) VALUES (?)";
    const [newState] = await this.pool.query(query, [state]);

    const newStateId = (newState as any).insertId;
    const [result] = await this.pool.query(
      "SELECT state FROM schedules_states WHERE id = ?",
      [newStateId],
    );
    return result;
  }

  async deleteScheduleState({ id }: { id: number }) {
    const query = "DELETE FROM schedules_states WHERE id = ?";
    const [result] = await this.pool.query(query, [id]);
    return result;
  }

  async updateScheduleState({ id, state }: { id: number; state: string }) {
    const query = "UPDATE schedules_states SET state = ? WHERE id = ?";
    await this.pool.query(query, [state, id]);
    const [result] = await this.pool.query(
      "SELECT state FROM schedules_states WHERE id = ?",
      [id],
    );
    return result;
  }

  async getSchedules({
    startDate,
    endDate,
    startTime,
    endTime,
  }: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
  }) {
    let query = `
            SELECT 
                m.title,
                s.start_date,
                s.start_time,
                r.room,
                st.state
            FROM schedules s
            JOIN movies m ON m.id = s.movie_id
            JOIN rooms r ON r.id = s.room_id
            JOIN schedules_states st ON st.id = s.state_id
        `;
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (startDate) {
      whereClauses.push("s.start_date >= ?");
      params.push(startDate);
    }

    if (endDate) {
      whereClauses.push("s.start_date <= ?");
      params.push(endDate);
    }

    if (startTime) {
      whereClauses.push("s.start_time >= ?");
      params.push(startTime);
    }

    if (endTime) {
      whereClauses.push("s.start_time <= ?");
      params.push(endTime);
    }

    query +=
      whereClauses.length > 0 ? ` WHERE ${whereClauses.join(" AND ")}` : "";
    query += " ORDER BY s.start_date ASC";

    const [schedules] = await this.pool.query(query, params);
    return schedules;
  }

  async getScheduleById({ id }: { id: number }) {
    const query = `
            SELECT 
            m.title,
            s.start_date,
            s.start_time,
            r.room,
            st.state
        FROM schedules s
        JOIN movies m ON m.id = s.movie_id
        JOIN rooms r ON r.id = s.room_id
        JOIN schedules_states st ON st.id = s.state_id
        WHERE s.id = ?
		ORDER BY s.id DESC
        ;
        `;
    const [schedule] = await this.pool.query(query, [id]);
    return schedule;
  }

  async createSchedule({
    movieId,
    roomId,
    startDate,
    startTime,
    stateId,
  }: {
    movieId: number;
    roomId: number;
    startDate: string;
    startTime: string;
    stateId: number;
  }) {
    const query = `
            INSERT INTO schedules (movie_id, room_id, start_time, start_date, state_id)
            VALUES (?, ?, ?, ?, ?)
        `;
    const [newSchedule] = await this.pool.query(query, [
      movieId,
      roomId,
      startTime,
      startDate,
      stateId,
    ]);
    const newScheduleId = (newSchedule as any).insertId;

    const result = await this.getScheduleById({ id: newScheduleId });

    return result;
  }

  async updateSchedule({
    id,
    movieId,
    roomId,
    startDate,
    startTime,
    stateId,
  }: {
    id: number;
    movieId?: number;
    roomId?: number;
    startDate?: string;
    startTime?: string;
    stateId?: number;
  }) {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (movieId) {
      fields.push("movie_id = ?");
      values.push(movieId);
    }

    if (roomId) {
      fields.push("room_id = ?");
      values.push(roomId);
    }

    if (startDate) {
      fields.push("start_date = ?");
      values.push(startDate);
    }

    if (startTime) {
      fields.push("start_time = ?");
      values.push(startTime);
    }

    if (stateId) {
      fields.push("schedules_states = ?");
      values.push(stateId);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const query = `
            UPDATE schedules 
            SET ${fields} 
            WHERE id = ?
        `;

    await this.pool.query(query, values);
    return await this.getScheduleById({ id });
  }

  //#endregion

  async getReservations() {
    const query = `
            SELECT 
                s.start_time,
                s.start_date,
                ro.room,
                concat(se.current_row, se.number) AS seat
                
            FROM reservations r
            JOIN schedules s ON s.id = r.schedule_id
            JOIN seats se ON se.id = r.seat_id
            JOIN reservation_states rs ON rs.id = r.state_id
            JOIN rooms ro ON ro.id = se.room_id
        `;

    const [reservations] = await this.pool.query(query);

    return reservations;
  }

  async getReservationById({ id }: { id: number }) {
    const query = `
            SELECT 
                s.start_time,
                s.start_date,
                ro.room,
                concat(se.current_row, se.number) AS seat
                
            FROM reservations r
            JOIN schedules s ON s.id = r.schedule_id
            JOIN seats se ON se.id = r.seat_id
            JOIN reservation_states rs ON rs.id = r.state_id
            JOIN rooms ro ON ro.id = se.room_id
            WHERE r.id = ?
        `;
    const [reservation] = await this.pool.query(query, [id]);
    return reservation;
  }
}
