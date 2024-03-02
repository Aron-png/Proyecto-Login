import {  useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { Navigate } from 'react-router-dom';
import { useAuth} from "../auth/AuthProvider";

export default function Signup(){
    const [Name, setName] = useState("")
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")

    //Si te registras en la página podras entrar a la nueva pestaña
    const auth = useAuth()
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return <>
    <DefaultLayout>
        <form className="form">
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