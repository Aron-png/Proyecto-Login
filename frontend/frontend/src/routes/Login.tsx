import {  useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth} from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
// Importar los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login(){
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")
    const [ErrorResponsed, setErrorResponsed] = useState("")

    //Agregamos otro hook (libreria), nos ayuda a redirigirnos a otra pág
    const goto = useNavigate();

    //Si registras los datos, con el boton subiras los datos
    //Cada funcion asincrona debe tener su await
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`,{
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        UserName,
                        Password
                    }),
            });
            if(response.ok){
                console.log("Login accedido");
                setErrorResponsed("");
                goto("/Login");
            }else{
                console.log("Something went wrong");
                const json = (await response.json()) as AuthResponseError;
                setErrorResponsed(json.body.error);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Si te logeas en la página podras entrar a la nueva pestaña
    const auth = useAuth()
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return <>
    <DefaultLayout>
        <form className="form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            
            <label>Username</label>
            <input type="text"
            value={UserName}
            onChange={(e)=>setUserName(e.target.value)}
            />

            <label>Password</label>
            <input type="password"
            value={Password}
            onChange={(e)=>setPassword(e.target.value)}
            />

            <button>Login</button>
            {!!ErrorResponsed && <div className="alert alert-danger mt-3">{ErrorResponsed}</div>}
        </form>
    </DefaultLayout>
    </>;
}