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
  title: string;
  start_date: string;
  start_time: string;
  room: string;
  state: string;
};

export class MySQLScheduleRepository implements ScheduleRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getScheduleStates(): Promise<
    ServiceResult<{ id: number; state: string }[]>
  > {
    const sql = `SELECT id, state FROM schedules_states`;
    const [rows] = await this.pool.query(sql);
    const states = (rows as RowDataPacket[]).map((row) => ({
      id: row.id,
      state: row.state,
    }));
    return { ok: true, data: states };
  }

  async createScheduleState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    const sql = `INSERT INTO schedules_states (state) VALUES (?)`;
    const [result] = await this.pool.query(sql, [state]);
    const insertId = (result as ResultSetHeader).insertId;
    return {
      ok: true,
      data: { id: insertId, state },
    };
  }

  async deleteScheduleState(id: number): Promise<ServiceResult<null>> {
    const sql = `DELETE FROM schedules_states WHERE id = ?`;
    const [result] = await this.pool.query(sql, [id]);
    if ((result as ResultSetHeader).affectedRows === 0) {
      return { ok: false, error: "Schedule state not found" };
    }
    return { ok: true, data: null };
  }

  async updateScheduleState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    const sql = `UPDATE schedules_states SET state = ? WHERE id = ?`;
    const [result] = await this.pool.query(sql, [state, id]);
    if ((result as ResultSetHeader).affectedRows === 0) {
      return { ok: false, error: "Schedule state not found" };
    }
    return { ok: true, data: { id, state } };
  }

  async getSchedules(
    filters?: ScheduleFilterData,
  ): Promise<ServiceResult<Schedule[]>> {
    const sql = this.getScheduleQuery(filters);
    const values: unknown[] = [];
    if (filters?.startDate) values.push(filters.startDate);
    if (filters?.endDate) values.push(filters.endDate);
    if (filters?.startTime) values.push(filters.startTime);
    if (filters?.endTime) values.push(filters.endTime);
    const [rows] = await this.pool.query(sql, values);
    return { ok: true, data: rows as Schedule[] };
  }

  async getScheduleById(id: number): Promise<ServiceResult<Schedule>> {
    const sql = `SELECT m.title, s.start_date, s.start_time, r.room, st.state
        FROM schedules s
        JOIN movies m ON m.id = s.movie_id
        JOIN rooms r ON r.id = s.room_id
        JOIN schedules_states st ON st.id = s.state_id
        WHERE s.id = ?
        `;
    const [rows] = await this.pool.query<ScheduleRow[]>(sql, [id]);
    if (rows.length === 0) {
      return { ok: false, error: "Schedule not found" };
    }

    return { ok: true, data: rows[0] as Schedule };
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

  private getScheduleQuery(filters?: ScheduleFilterData): string {
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

    if (filters?.startDate) {
      whereClauses.push("s.start_date >= ?");
    }

    if (filters?.endDate) {
      whereClauses.push("s.start_date <= ?");
    }

    if (filters?.startTime) {
      whereClauses.push("s.start_time >= ?");
    }

    if (filters?.endTime) {
      whereClauses.push("s.start_time <= ?");
    }

    query +=
      whereClauses.length > 0 ? ` WHERE ${whereClauses.join(" AND ")}` : "";
    query += " ORDER BY s.start_date ASC";

    return query;
  }
}
