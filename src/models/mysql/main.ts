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

  constructor() {
    this.pool = mysql2.createPool(DEFAULT_DB_CONFIG);
  }

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
