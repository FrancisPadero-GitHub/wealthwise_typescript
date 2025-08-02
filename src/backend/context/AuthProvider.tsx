import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type FC,
} from "react";
import { supabase } from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

// Define the context shape
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Provide default context value (all null / loading true)
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

// Props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get current session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Cleanup listener
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextType => useContext(AuthContext);
