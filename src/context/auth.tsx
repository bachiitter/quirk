import * as React from "react";
import type { Session, User } from "lucia-auth";

export interface UserSession extends Session {
  user: User;
}

export type SessionState =
  | {
      isLoading: true;
      session: null;
    }
  | {
      isLoading: false;
      session: UserSession;
    }
  | {
      isLoading: false;
      session: null;
    };

export type AuthContext = {
  refreshSession: () => Promise<UserSession | null>;
} & SessionState;

export const AuthContext = React.createContext<AuthContext>({
  session: null,
  isLoading: true,
  refreshSession: () => Promise.resolve(null),
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = React.useState<SessionState>({
    session: null,
    isLoading: true,
  });

  // Keep the session in sync
  React.useEffect(() => {
    let mounted = true;

    void fetchData<UserSession>("/api/auth/session").then((session) => {
      if (mounted) {
        setState({
          isLoading: false,
          session,
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Helper method to refresh the session.
  const refreshSession = React.useCallback(async () => {
    const session = await fetchData<UserSession>("/api/auth/session");

    return session;
  }, []);

  const value = React.useMemo(() => {
    return { ...state, refreshSession } as const;
  }, [state, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** Auth Helpers */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider.`);
  }

  return context;
};

export const useSession = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useSession must be used within a AuthProvider.`);
  }

  return context.session;
};

export const useUser = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a AuthProvider.`);
  }

  return context.session?.user ?? null;
};

// Helper to redirect to signin
export function signIn(provider?: string) {
  if (!provider) {
    window.location.href = "/";
  } else {
    window.location.href = `/api/auth/signin/${provider}`;
  }
}

// Helper to redirect to signout

export function signOut() {
  window.location.href = "/";

  return React.useCallback(async () => {
    const res = await fetch("/api/auth/signout", {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to sign out");
    }
  }, []);
}

/** Helper to fetch data from the server  */
export async function fetchData<T = any>(path: string): Promise<T | null> {
  const url = `${path}`;
  try {
    const options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw data;

    // @ts-expect-error type error
    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    return null;
  }
}
