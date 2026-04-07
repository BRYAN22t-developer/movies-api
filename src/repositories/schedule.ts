import mysql from "mysql2/promise";
import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type {
  createScheduleData,
  Schedule,
  ScheduleFilterData,
  ScheduleRepository,
  ServiceResult,
  updateScheduleData,
} from "../types/schedule.types.js";

type ScheduleRow = RowDataPacket & {
  id: number;
  movieId: number;
  roomId: number;
  stateId: number;
  title: string;
  startTime: Date;
  endTime: Date;
};

export class MySQLScheduleRepository implements ScheduleRepository {
  private pool: Pool;
  constructor() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) throw new Error("DATABASE_URL is not defined");
    this.pool = mysql.createPool(DATABASE_URL);
  }

  async getSchedule(
    filters?: ScheduleFilterData,
  ): Promise<ServiceResult<Schedule[]>> {
    const sql = this.getScheduleQuery(filters);
    const [rows] = await this.pool.query(sql);
    return { ok: true, data: rows as Schedule[] };
  }

  async getScheduleById(id: number): Promise<ServiceResult<Schedule>> {
    const sql = `SELECT s.id, s.movie_id AS movieId, s.room_id AS roomId, s.state_id AS stateId, m.title, s.start_time AS startTime, s.end_time AS endTime
        FROM schedules s
        JOIN movies m ON m.id = s.movie_id
        WHERE s.id = ?
        `;
    const [rows] = await this.pool.query<ScheduleRow[]>(sql, [id]);
    if (rows.length === 0) {
      return { ok: false, error: "Schedule not found" };
    }

    if (!rows[0]) {
      return { ok: false, error: "Schedule not found" };
    }

    return { ok: true, data: this.parseSchedule(rows[0]) };
  }

  async createSchedule(
    data: createScheduleData,
  ): Promise<ServiceResult<Schedule>> {
    const { sql, values } = this.createScheduleQuery(data);
    const [result] = await this.pool.query(sql, values);
    const insertId = (result as ResultSetHeader).insertId;
    return await this.getScheduleById(insertId);
  }

  async updateSchedule(
    id: number,
    data: updateScheduleData,
  ): Promise<ServiceResult<Schedule>> {
    const updateQueryResult = this.createUpdateScheduleQuery(id, data);
    if (!updateQueryResult.ok) {
      return { ok: false, error: updateQueryResult.error };
    }
    const { sql, values } = updateQueryResult.data;
    await this.pool.query(sql, values);
    return await this.getScheduleById(id);
  }

  async deleteSchedule(id: number): Promise<ServiceResult<null>> {
    const sql = `DELETE FROM schedules WHERE id = ?`;
    const [result] = await this.pool.query(sql, [id]);
    if ((result as ResultSetHeader).affectedRows === 0) {
      return { ok: false, error: "Schedule not found" };
    }
    return { ok: true, data: null };
  }

  private createUpdateScheduleQuery(
    id: number,
    data: updateScheduleData,
  ): ServiceResult<{ sql: string; values: unknown[] }> {
    const fields = [];
    const values = [];

    if (data.movieId !== undefined) {
      fields.push("movie_id = ?");
      values.push(data.movieId);
    }

    if (data.roomId !== undefined) {
      fields.push("room_id = ?");
      values.push(data.roomId);
    }

    if (data.startDate !== undefined) {
      fields.push("start_date = ?");
      values.push(data.startDate);
    }

    if (data.startTime !== undefined) {
      fields.push("start_time = ?");
      values.push(data.startTime);
    }

    if (data.stateId !== undefined) {
      fields.push("state_id = ?");
      values.push(data.stateId);
    }

    if (fields.length === 0) {
      return { ok: false, error: "No fields to update" };
    }

    const sql = `UPDATE schedules SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    return { ok: true, data: { sql, values } };
  }

  private createScheduleQuery(data: createScheduleData): {
    sql: string;
    values: unknown[];
  } {
    return {
      sql: `
            INSERT INTO schedules (movie_id, room_id, start_time, start_date, state_id)
            VALUES (?, ?, ?, ?, ?)
    `,
      values: [
        data.movieId,
        data.roomId,
        data.startTime,
        data.startDate,
        data.stateId,
      ],
    };
  }

  private getScheduleQuery(filters?: ScheduleFilterData): {
    sql: string;
    values: unknown[];
  } {
    let sql = `SELECT s.id, s.movie_id AS movieId, s.room_id AS roomId, s.state_id AS stateId, m.title, s.start_time AS startTime, s.end_time AS endTime
        FROM schedules s
        JOIN movies m ON m.id = s.movie_id`;

    const conditions: string[] = [];
    if (filters?.startDate) {
      conditions.push("s.start_time >= ?");
    }
    if (filters?.endDate) {
      conditions.push("s.end_time <= ?");
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    return {
      sql,
      values: [filters?.startDate, filters?.endDate].filter(Boolean),
    };
  }

  private parseSchedule(row: ScheduleRow): Schedule {
    return {
      id: row.id,
      movieId: row.movieId,
      roomId: row.roomId,
      stateId: row.stateId,
      title: row.title,
      startTime: row.startTime.toISOString(),
      startDate: row.startDate.toISOString(),
    };
  }
}
