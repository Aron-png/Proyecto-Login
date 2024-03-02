import DefaultLayout from "../layout/DefaultLayout";
import { Navigate } from 'react-router-dom';
import { useAuth} from "../auth/AuthProvider";

export default function Home(){

    //Si te logeas en la página podras entrar a la nueva pestaña
    const auth = useAuth()
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return <>
    <DefaultLayout>
        <h1>
            Prueba
        </h1>
    </DefaultLayout>
    </>;
}