"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  entityType: "user" | "provider" | null;
  setAuth: (token: string, entityType: "user" | "provider") => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entityType, setEntityType] = useState<"user" | "provider" | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedEntityType = localStorage.getItem("entity_type") as
      | "user"
      | "provider"
      | null;
    if (token && storedEntityType) {
      setIsAuthenticated(true);
      setEntityType(storedEntityType);
    }
  }, []);

  const setAuth = (token: string, entityType: "user" | "provider") => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("entity_type", entityType);
    setIsAuthenticated(true);
    setEntityType(entityType);
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("entity_type");
    setIsAuthenticated(false);
    setEntityType(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, entityType, setAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
