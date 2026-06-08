export type Rol = "ADMIN" | "CONSULTA";

export interface User {
  username: string;
  rol: Rol;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}