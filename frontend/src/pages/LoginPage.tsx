import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      login(data.access_token);
      navigate("/lista"); // Redirige a la lista tras login exitoso
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión - Registro de Participantes</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-500 text-center mb-3">Acceso rápido</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setUsername("admin"); setPassword("admin123"); }}
              className="flex-1 bg-red-600 text-white p-2 rounded text-sm hover:bg-red-700"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setUsername("user"); setPassword("user123"); }}
              className="flex-1 bg-green-600 text-white p-2 rounded text-sm hover:bg-green-700"
            >
              Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}