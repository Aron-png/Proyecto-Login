import {  useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth} from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
// Importar los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup(){
    const [Name, setName] = useState("")
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
            const response = await fetch(`${API_URL}/signup`,{
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        username: UserName,
                        name: Name,
                        password: Password
                    }),
            });
            if(response.ok){
                console.log("El usuario se ah creado satisfactoriamente");
                console.log("Datos enviados del frontend:", { UserName, Name, Password });
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

    //Si te registras en la página podras entrar a la nueva pestaña
    const auth = useAuth()
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return <>
    <DefaultLayout>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form className="mt-5 p-4 border rounded shadow" onSubmit={handleSubmit}>
                            <h1 className="mb-4">Sign up</h1>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" id="name" className="form-control" value={Name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input type="text" id="username" className="form-control" value={UserName} onChange={(e) => setUserName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" id="password" className="form-control" value={Password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">Create user</button>
                            </div>
                            
                            {!!ErrorResponsed && <div className="alert alert-danger mt-3">{ErrorResponsed}</div>}
                            
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    </>;
}