import {  useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { Navigate } from 'react-router-dom';
import { useAuth} from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

export default function Signup(){
    const [Name, setName] = useState("")
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")

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
                        UserName,
                        Name,
                        Password
                    }),
            });
            if(response.ok){
                console.log("El usuario se ah creado satisfactoriamente");
            }else{
                console.log("Something went wrong");
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
        <form className="form" onSubmit={handleSubmit}>
            <h1>Sign up</h1>

            <label>Name</label>
            <input type="text"
            value={Name}
            onChange={(e)=>setName(e.target.value)}
            />
            
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

            <button>Create user</button>
        </form>
    </DefaultLayout>
    </>;
}