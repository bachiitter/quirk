/* eslint-disable @typescript-eslint/consistent-type-imports */

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./server/auth.js").Auth;
  interface DatabaseUserAttributes {
    name: string | null;
    username: string;
    email: string | null;
    image: string | null;
  }
  interface DatabaseSessionAttributes {
    created_at: Date;
  }
}
