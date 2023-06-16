export interface Env {
  ENVIRONMENT: string;

  LUCIA_AUTH_URL: string;

  STRIPE_API_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRO_MONTHLY_PLAN_ID: string;

  DATABASE_URL: string;

  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}
