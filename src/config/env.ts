function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}

function toNumber(value: string, name: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }
  return parsed;
}

export const env = {
  PORT: toNumber(process.env.PORT ?? "3000", "PORT"),
  DB_HOST: required("DB_HOST"),
  DB_PORT: toNumber(required("DB_PORT"), "DB_PORT"),
  DB_NAME: required("DB_NAME"),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  JWT_SECRET: required("JWT_SECRET"),
  SALT_ROUNDS: toNumber(process.env.SALT_ROUNDS ?? "10", "SALT_ROUNDS"),
};
