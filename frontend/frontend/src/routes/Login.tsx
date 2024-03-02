import {  useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { Navigate } from 'react-router-dom';
import { useAuth} from "../auth/AuthProvider";

export default function Login(){
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")

    //Si te logeas en la página podras entrar a la nueva pestaña
    const auth = useAuth()
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return <>
    <DefaultLayout>
        <form className="form">
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
        </form>
    </DefaultLayout>
    </>;
}