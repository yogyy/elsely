import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ElyUser {
  created_at: Generated<Timestamp>;
  email: string;
  id: string;
  is_active: Generated<boolean>;
  name: string;
  password: string;
  role: Generated<"developer" | "user" | "verified">;
  updated_at: Generated<Timestamp>;
  username: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

export interface DB {
  ely_user: ElyUser;
}
