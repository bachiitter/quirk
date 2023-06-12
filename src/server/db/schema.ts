import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Key {
  id: string;
  hashed_password: string | null;
  user_id: string;
}
export interface Session {
  id: string;
  user_id: string;
  active_expires: number;
  idle_expires: number;
  created_at: Timestamp;
}
export interface User {
  id: string;
  name: string | null;
  username: string;
  email: string;
  image: string | null;
  provider: string;
}
export interface DB {
  key: Key;
  session: Session;
  user: User;
}
