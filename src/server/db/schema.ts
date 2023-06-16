import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Key = {
  id: string;
  hashed_password: string | null;
  user_id: string;
};
export type Session = {
  id: string;
  user_id: string;
  active_expires: number;
  idle_expires: number;
  created_at: Timestamp;
  device_type: string;
  browser_name: string;
};
export type User = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  image: string | null;
  provider: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: Timestamp | null;
};
export type DB = {
  key: Key;
  session: Session;
  user: User;
};
