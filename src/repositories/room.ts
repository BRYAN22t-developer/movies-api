import type { Pool, RowDataPacket } from "mysql2/promise";
import type {
  CreateSeatData,
  GetRoomsFilters,
  GetSeatsFilters,
  Room,
  RoomRepository,
  Seat,
  ServiceResult,
  UpdateSeatData,
} from "../types/rooms.types.js";

type RoomRow = RowDataPacket & {
  id: number;
  name: string;
};

type SeatRow = RowDataPacket & {
  id: number;
  roomId: number;
  row: string;
  column: number;
};

export class MySQLRoomRepository implements RoomRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getRooms(filters?: GetRoomsFilters): Promise<ServiceResult<Room[]>> {
    const query = this.getRoomsQuery(filters);
    const [rows] = await this.pool.query<RoomRow[]>(query.sql, query.values);
    return { ok: true, data: rows.map(this.mapRoomRowToRoom) };
  }

  async getRoomById(roomId: number): Promise<ServiceResult<Room>> {
    const query = this.getRoomsQuery();
    const sql = query.sql + " WHERE r.id = ?";
    const [rows] = await this.pool.query<RoomRow[]>(sql, [
      ...query.values,
      roomId,
    ]);
    if (rows.length === 0) {
      return { ok: false, error: "Room not found" };
    }
    return { ok: true, data: this.mapRoomRowToRoom(rows[0] as RoomRow) };
  }

  async createRoom(name: string): Promise<ServiceResult<Room>> {
    const sql = `INSERT INTO rooms (room) VALUES (?)`;
    const [result] = await this.pool.execute(sql, [name]);
    const insertId = (result as any).insertId;
    return this.getRoomById(insertId);
  }

  async deleteRoom(roomId: number): Promise<ServiceResult<null>> {
    const sql = `DELETE FROM rooms WHERE id = ?`;
    await this.pool.execute(sql, [roomId]);
    return { ok: true, data: null };
  }

  async updateRoom(roomId: number, name: string): Promise<ServiceResult<Room>> {
    const sql = `UPDATE rooms SET room = ? WHERE id = ?`;
    await this.pool.execute(sql, [name, roomId]);
    return this.getRoomById(roomId);
  }

  async getSeats(filters?: GetSeatsFilters): Promise<ServiceResult<Seat[]>> {
    const query = this.getSeatsQuery(filters);
    const [rows] = await this.pool.query<SeatRow[]>(query.sql, query.values);
    return { ok: true, data: rows.map(this.mapSeatRowToSeat) };
  }

  async getSeatById(seatId: number): Promise<ServiceResult<Seat>> {
    const query = this.getSeatsQuery({ filterByRoomId: seatId });
    const [rows] = await this.pool.query<SeatRow[]>(query.sql, query.values);
    if (rows.length === 0) {
      return { ok: false, error: "Seat not found" };
    }
    return { ok: true, data: this.mapSeatRowToSeat(rows[0] as SeatRow) };
  }

  async createSeat(data: CreateSeatData): Promise<ServiceResult<Seat>> {
    const sql = `INSERT INTO seats (roomId, row, column) VALUES (?, ?, ?)`;
    const [result] = await this.pool.execute(sql, [
      data.roomId,
      data.row,
      data.column,
    ]);
    const insertId = (result as any).insertId;
    return this.getSeatById(insertId);
  }

  async deleteSeat(seatId: number): Promise<ServiceResult<null>> {
    const sql = `DELETE FROM seats WHERE id = ?`;
    await this.pool.execute(sql, [seatId]);
    return { ok: true, data: null };
  }

  async updateSeat(
    seatId: number,
    data: UpdateSeatData,
  ): Promise<ServiceResult<Seat>> {
    const query = this.updateSeatQuery(seatId, data);
    if (!query.ok) {
      return { ok: false, error: query.error };
    }
    const { sql, values } = query.data;
    await this.pool.query(sql + " WHERE id = ?", [...values, seatId]);
    return this.getSeatById(seatId);
  }

  private mapRoomRowToRoom(row: RoomRow): Room {
    return {
      id: row.id,
      name: row.name,
    };
  }

  private mapSeatRowToSeat(row: SeatRow): Seat {
    return {
      id: row.id,
      roomId: row.roomId,
      row: row.row,
      column: row.column,
    };
  }

  private getRoomsQuery(filters?: GetRoomsFilters) {
    const values: unknown[] = [];

    if (filters?.includeSeats) {
      const sql = `
      SELECT
        r.id,
        r.rooms AS name,
        CASE
          WHEN COUNT(s.id) = 0 THEN JSON_ARRAY()
          ELSE JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', s.id,
              'number', s.number
            )
          )
        END AS seats
      FROM rooms r
      LEFT JOIN seats s ON s.roomId = r.id
      GROUP BY r.id, r.rooms
    `;

      return { sql, values };
    }

    const sql = `
    SELECT
      r.id,
      r.rooms AS name
    FROM rooms r
  `;

    return { sql, values };
  }

  private getSeatsQuery(filters?: GetSeatsFilters) {
    let sql = `SELECT id, roomId, row, column FROM seats`;
    const values: unknown[] = [];
    const conditions: string[] = [];

    if (filters?.filterByRoomId) {
      conditions.push("roomId = ?");
      values.push(filters.filterByRoomId);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    return { sql, values };
  }

  private updateSeatQuery(
    seatId: number,
    data: UpdateSeatData,
  ): ServiceResult<{ sql: string; values: unknown[] }> {
    const sql = `UPDATE seats SET `;
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.roomId !== undefined) {
      fields.push("roomId = ?");
      values.push(data.roomId);
    }

    if (data.row !== undefined) {
      fields.push("row = ?");
      values.push(data.row);
    }

    if (data.column !== undefined) {
      fields.push("column = ?");
      values.push(data.column);
    }

    if (fields.length === 0) {
      return { ok: false, error: "No fields to update" };
    }

    return { ok: true, data: { sql, values } };
  }
}
