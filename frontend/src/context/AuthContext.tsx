import { createContext, useContext, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { type User, type AuthContextType } from "../models/Auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializamos el token leyendo directamente del storage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  // Inicializamos el usuario decodificando el token de inmediato
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<{ sub: string; rol: "ADMIN" | "CONSULTA" }>(storedToken);
        return { username: decoded.sub, rol: decoded.rol };
      } catch (error) {
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode<{ sub: string; rol: "ADMIN" | "CONSULTA" }>(newToken);
    setToken(newToken);
    setUser({ username: decoded.sub, rol: decoded.rol });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};