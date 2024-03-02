// Se importan los hooks useContext, createContext, useState y useEffect de React.
import { useContext, createContext, useState, useEffect } from "react";

/*
        interface AuthProviderProps
Nuestro componente que valida constantemente para verificar si puede
acceder a la información; normalmente envíada por el backend.
*/

interface AuthProviderProps{
    children: React.ReactNode;
}

//      AuthContext
// Este contexto se utiliza para almacenar información sobre 
// el estado de autenticación del usuario actual.
const AuthContext = createContext({
    isAuthenticated: false,
})

//      AuthProvider
/*
Se define un componente AuthProvider que recibe una prop children. 
Esta prop representa el contenido del componente que se envolverá 
con el contexto de autenticación.

Dentro del componente AuthProvider, se define un estado 
isAuthenticated usando el hook useState. Este estado se utiliza 
para almacenar el estado de autenticación actual del usuario.

El componente AuthProvider devuelve un proveedor de contexto 
AuthContext.Provider. 
<<IMPORTANTE: El proveedor de contexto proporciona el 
valor actual de isAuthenticated a sus hijos.>>
*/
export function AuthProvider({children}:AuthProviderProps){
    
    const [isAuthenticated, setisAuthenticated] = useState(false);

    return <AuthContext.Provider value={{isAuthenticated }}>
        {children}
    </AuthContext.Provider>
}

//Vamos a crear un hook que nos permita a acceder a las funciones del useContext
export const useAuth = () => useContext(AuthContext);

