import { useEffect, useState } from "react";
import {useAuth} from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import PortalLayout from "../layout/PortalLayout";
/*
Aquí vamos a tener información de los To do's
*/
//Define las propiedades de los to dos
interface MyTodo{
    _id: string,
    title: string,
    completed: boolean,
    idUser:string,
}
export default function Dashboard(){
    //para guardar los to dos
    const [todos, setTodos] = useState<MyTodo[]>([]);
    const [title, setTitle] = useState("");
    const auth = useAuth();

    useEffect(()=>{
        loadTodos();
    },[]);
/*
(e: React.FormEvent<HTMLFormElement>): Este es el parámetro de la función. 
"e" es un objeto de tipo React.FormEvent, que representa el evento de envío 
del formulario.  HTMLFormElement es el tipo del elemento que está siendo enviado, 
es decir, el formulario HTML. Al proporcionar el tipo, TypeScript puede realizar 
comprobaciones de tipo estático para garantizar que la función solo se use 
con eventos de formularios válidos.
*/
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        createTodo();
    }
    //La llamada http para poder conectarnos a nuestra API y crear un nuevo todo
    async function createTodo(){
        try {
            const response = await fetch(`${API_URL}/todos`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${auth.getAccessToken()}`,

                },
                body:JSON.stringify({
                    title,
                }),
            });

            if(response.ok){
                //Si tenemos bien la información, la tenemos que transformar.
                const json = await response.json();
                setTodos([json, ...todos]);
            }else{
                //Mostrar un error de conexión en la web
            }
            const data = await response.json();
            setTodos(data);    

        } catch (error) {
            
        }
        
    }
    async function loadTodos(){
        try {
            const response = await fetch(`${API_URL}/todos`,{
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${auth.getAccessToken()}`,

                },
            });

            if(response.ok){
                //Si tenemos bien la información, la tenemos que transformar.
                const json = await response.json();
                setTodos(json);
            }else{
                //Mostrar un error de conexión en la web
            }
            const data = await response.json();
            setTodos(data);    

        } catch (error) {
            
        }
        
    }

    return <div>
        <PortalLayout>
        <h1>Dashboard de {auth.getUser()?.name || ""}</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nuevo To do..." onChange=
                {
                (e)=>setTitle(e.target.value)
                } 
                value={title}/>
        </form>
        {
            todos.map((todo)=>(
            <div key={todo._id}>{todo.title}</div>
            ))
        }
        
        
        </PortalLayout>
    </div>;

}