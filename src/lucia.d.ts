/* eslint-disable @typescript-eslint/consistent-type-imports */

/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("./server/auth.js").Auth;
  interface UserAttributes {
    name?: string;
    username: string;
    email: string;
    image?: string;
  }
}
