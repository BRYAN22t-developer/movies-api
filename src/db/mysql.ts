import mysql, { type Pool } from "mysql2/promise";
import { env } from "../config/env.js";
import { get } from "http";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;

  console.log(env.DB_NAME);

  pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}
