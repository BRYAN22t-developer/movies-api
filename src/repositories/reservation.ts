import mysql from "mysql2/promise";
import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type {
  CreateReservationData,
  Reservation,
  ReservationRepository,
  ServiceResult,
  updateReservationData,
} from "../types/reservation.types.js";

type ReservationRow = RowDataPacket & {
  startTime: string;
  startDate: string;
  room: string;
  movieTitle: string;
  state: string;
  user: string;
  seat: string;
};

type StateRow = RowDataPacket & {
  id: number;
  state: string;
};

export class MySQLReservationRepository implements ReservationRepository {
  private pool: Pool;
  constructor() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) throw new Error("DATABASE_URL is not defined");
    this.pool = mysql.createPool(DATABASE_URL);
  }

  async getReservations(): Promise<ServiceResult<Reservation[]>> {
    const sql = this.getReservationQuery();
    const [rows] = await this.pool.query<ReservationRow[]>(sql);
    return { ok: true, data: rows };
  }

  async getReservationById(id: number): Promise<ServiceResult<Reservation>> {
    const sql = this.getReservationQuery() + " WHERE r.id = ?";
    const [rows] = await this.pool.query<ReservationRow[]>(sql, [id]);
    if (rows.length === 0) {
      return { ok: false, error: "Reservation not found" };
    }
    return { ok: true, data: rows[0] as Reservation };
  }

  async createReservation(
    data: CreateReservationData,
  ): Promise<ServiceResult<Reservation>> {
    const sql = `INSERT INTO reservations (schedule_id, user_id, seat_id, state_id) VALUES (?, ?, ?, ?)`;
    const [result] = await this.pool.execute(sql, [
      data.scheduleId,
      data.userId,
      data.seatId,
      data.stateId,
    ]);
    const insertId = (result as ResultSetHeader).insertId;
    return await this.getReservationById(insertId);
  }

  async updateReservation(
    id: number,
    data: updateReservationData,
  ): Promise<ServiceResult<Reservation>> {
    const result = this.updateReservationQuery(id, data);

    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    const { sql, values } = result.data;
    await this.pool.query(sql, values);

    return await this.getReservationById(id);
  }

  async deleteReservation(id: number): Promise<ServiceResult<null>> {
    const sql = `DELETE FROM reservations WHERE id = ?`;
    const [result] = await this.pool.query(sql, [id]);
    if ((result as ResultSetHeader).affectedRows === 0) {
      return { ok: false, error: "Reservation not found" };
    }
    return { ok: true, data: null };
  }

  async getReservationStates(): Promise<
    ServiceResult<{ id: number; state: string }[]>
  > {
    const sql = `SELECT id, state FROM reservation_states`;
    const [rows] = await this.pool.query<StateRow[]>(sql);
    const states = rows.map((row) => ({ id: row.id, state: row.state }));
    return { ok: true, data: states };
  }

  async getReservationStateById(
    id: number,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    const sql = `SELECT id, state FROM reservation_states WHERE id = ?`;
    const [rows] = await this.pool.query<StateRow[]>(sql, [id]);

    if (rows.length === 0) {
      return { ok: false, error: "Reservation state not found" };
    }

    return { ok: true, data: rows[0] as { id: number; state: string } };
  }

  async createReservationState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    const sql = `INSERT INTO reservation_states (state) VALUES (?)`;
    const [result] = await this.pool.query(sql, [state]);
    const insertId = (result as ResultSetHeader).insertId;

    return await this.getReservationStateById(insertId);
  }

  async deleteReservationState(id: number): Promise<ServiceResult<null>> {
    const sql = `DELETE FROM reservation_states WHERE id = ?`;
    const [result] = await this.pool.query(sql, [id]);
    if ((result as ResultSetHeader).affectedRows === 0) {
      return { ok: false, error: "Reservation state not found" };
    }
    return { ok: true, data: null };
  }

  async updateReservationState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    if (
      isNaN(id) ||
      id <= 0 ||
      typeof state !== "string" ||
      state.trim() === ""
    ) {
      return { ok: false, error: "Invalid reservation state ID" };
    }

    const sql = `UPDATE reservation_states SET state = ? WHERE id = ?`;
    const [result] = await this.pool.query(sql, [state, id]);
    return await this.getReservationStateById(id);
  }

  private updateReservationQuery(
    id: number,
    data: updateReservationData,
  ): ServiceResult<{ sql: string; values: unknown[] }> {
    const fields = [];
    const values = [];

    if (data.scheduleId !== undefined) {
      fields.push("schedule_id = ?");
      values.push(data.scheduleId);
    }

    if (data.userId !== undefined) {
      fields.push("user_id = ?");
      values.push(data.userId);
    }

    if (data.seatId !== undefined) {
      fields.push("seat_id = ?");
      values.push(data.seatId);
    }

    if (data.stateId !== undefined) {
      fields.push("state_id = ?");
      values.push(data.stateId);
    }

    values.push(id);

    if (fields.length === 0) {
      return { ok: false, error: "No fields to update" };
    }

    const sql = `UPDATE reservations SET ${fields.join(", ")} WHERE id = ?`;

    return { ok: true, data: { sql, values } };
  }

  private getReservationQuery() {
    const sql = `SELECT r.id, 
            sc.start_time AS startTime, 
            sc.start_date AS startDate, 
            rm.room AS room, 
            m.title AS movieTitle, 
            rs.state, 
            u.username AS user, 
            concat(s.number, current_row) AS seat
                    FROM reservations r
                    JOIN schedules sc ON sc.id = r.schedule_id
                    JOIN rooms rm ON rm.id = sc.room_id
                    JOIN movies m ON m.id = sc.movie_id
                    JOIN reservation_states rs ON rs.id = r.state_id
                    JOIN users u ON u.id = r.user_id
                    JOIN seats s ON s.id = r.seat_id`;
    return sql;
  }
}
