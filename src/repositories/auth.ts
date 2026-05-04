import type { Pool, RowDataPacket } from "mysql2/promise";
import type {
  AuthRepository,
  PermissionIsAllowedData,
  ServiceResult,
  UserAuthRecord,
} from "../types/auth.types.js";

export class MySQLAuthRepository implements AuthRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createUser(data: {
    username: string;
    password: string;
  }): Promise<ServiceResult<{ id: number }>> {
    const { username, password } = data;
    if (!username || !password)
      return { ok: false, error: "username or password is undefined" };

    const [rows] = await this.pool.query<RowDataPacket[]>(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
    );

    const userId: number = (rows as any).insertId;
    return { ok: true, data: { id: userId } };
  }

  async findUserByUsername(username: string): Promise<UserAuthRecord | null> {
    const query = "SELECT id, username, password FROM users WHERE username = ?";
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [username]);
    if (!rows || rows.length === 0) return null;
    return rows[0] as UserAuthRecord;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await this.pool.query(
      "INSERT INTO users_roles (user_id, role_id) VALUES (?, ?)",
      [userId, roleId],
    );
  }

  async getRoleIdByName(name: string): Promise<number | null> {
    const query = "SELECT id FROM roles WHERE LOWER(roles.role) = LOWER(?)";
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [name]);
    return rows[0]?.id;
  }

  async permissionIsAllowed(data: PermissionIsAllowedData): Promise<boolean> {
    const { userId, permission } = data;
    const query = `
            SELECT EXISTS (
                SELECT 1
                FROM users_roles ur
                JOIN roles_permissions rp ON ur.role_id = rp.role_id
                JOIN permissions p ON p.id = rp.permission_id
                WHERE ur.user_id = ?
                AND p.permission = ?
            ) AS has_permission;
        `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [
      userId,
      permission,
    ]);

    return Boolean(rows[0]?.has_permission);
  }

  async deleteUserById(userId: number): Promise<void> {
    await this.pool.query("DELETE FROM users WHERE id = ?", [userId]);
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    await this.pool.query("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);
  }

  async getUserById(id: number): Promise<UserAuthRecord | null> {
    const query = "SELECT id, username, password FROM users WHERE id = ?";
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [id]);
    if (!rows || rows.length === 0) return null;
    return rows[0] as UserAuthRecord;
  }

  async updateUser(
    id: number,
    data: { username?: string; password?: string },
  ): Promise<void> {
    const { username, password } = data;
    let query = "UPDATE users SET ";
    const params: any[] = [];
    const updates: string[] = [];
    if (username) {
      updates.push("username = ?");
      params.push(username);
    }
    if (password) {
      updates.push("password = ?");
      params.push(password);
    }
    if (updates.length === 0) return;
    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);
    await this.pool.query(query, params);
  }

  async getusersWithRole(roleName: string): Promise<UserAuthRecord[]> {
    const query = `
      SELECT u.id, u.username, u.password
      FROM users u
      JOIN users_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE LOWER(r.role) = LOWER(?)
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [roleName]);
    return rows as UserAuthRecord[];
  }
}
