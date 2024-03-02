//Función de la página web
//Si el usuario está auntenticado, te deja ver el contenido de ésa ruta sino te redirige a otra ruta.

import { Outlet, Navigate } from "react-router-dom"; //El Navigate te sirve para redirigirse a pág.
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute(){
    const Auth = useAuth();
    //Operador ternario:
    //condición ? valor_si_verdadero : valor_si_falso
    return Auth.isAuthenticated ? <Outlet/> : <Navigate to="/"/>
}