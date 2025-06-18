// Importamos funciones necesarias desde React
import { createContext, useContext, useEffect, useState } from "react";

// Definimos el tipo de datos que tendrá el contexto: un JWT y una función para cambiarlo
interface AuthContextType {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}

// Creamos el contexto con un valor inicial por defecto
export const AuthContext = createContext<AuthContextType>({
  jwt: null,
  setJwt: () => {}, // función vacía por defecto (no hace nada)
});

// Creamos el proveedor del contexto, que envolverá nuestra app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado interno que contiene el JWT (o null si no hay)
  const [jwt, setJwt] = useState<string | null>(null);

  // Al cargar la app, revisamos si ya hay un JWT guardado en localStorage
  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) setJwt(storedJwt); // Si hay, lo restauramos al estado
  }, []);

  // Devolvemos el proveedor del contexto con el JWT actual y su función para actualizarlo
  return (
    <AuthContext.Provider value={{ jwt, setJwt }}>
      {children}
    </AuthContext.Provider>
  );
};

// Creamos un hook personalizado para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
