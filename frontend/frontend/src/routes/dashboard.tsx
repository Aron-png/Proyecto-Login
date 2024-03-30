import { useEffect, useState } from "react";
import {useAuth} from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import PortalLayout from "../layout/PortalLayout";
import type { ToDo } from "../types/types";

export default function Dashboard(){
    //Estado adicional para controlar si AllToDoOrganize() ya se ejecutó
    const [RunCode, setRunCode] = useState(false); 
    const [allToDo, setAllToDoFinally] = useState<ToDo[]>([]);
    const [title, setTitle] = useState("");
    const auth = useAuth();
    //Se transforma el ToDo[] en array para organizarlo.
    const [TodoOrganize, setTodoOrganize] = useState({
        time: [] as Date[],
        text: [] as string[],
        name: [] as string[]
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        createTodo();
    }
    //crear un nuevo To Do's
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
                const json = await response.json();
                setAllToDoFinally([json, ...allToDo]);
                // Llamar a RefreshToDo() después de crear un nuevo ToDo
                await RefreshToDo();
            }
              

        } catch (error) {
            console.error("Error al buscar todos:", error);
        }
        
    }

    async function getAllAccessToken(refreshToken: string) {
        try {
            const response = await fetch(`${API_URL}/allAccessTokens`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`,
                },
            });
            if (response.ok) {
                const json = await response.json();
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.accessTokens;

            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getAllToDo(accessToken: string) {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const json = await response.json();
                if (json.error) {
                    throw new Error(json.error);
                }
                return json;

            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function RefreshToDo() {
        try {
            const YouRefreshToken: string | null = auth.getRefreshToken();
            if (YouRefreshToken !== null) {
                const allAccessToken = await getAllAccessToken(YouRefreshToken!);
                if (allAccessToken.length > 0) {
                    const newToDos: ToDo[] = [];
                    await Promise.all(allAccessToken.map(async (item: string) => {
                        const userName = await auth.getUserInfo(item); // saca el nombre
                        const todos = await getAllToDo(item); // saca el OBJETO To do's
                        if (Array.isArray(todos)) {
                            newToDos.push({
                                name: userName.name,
                                TodoString: todos.map((obj: { title: string }) => obj.title),
                                TodayDate: todos.map((obj: { createdAt: Date }) => obj.createdAt)
                            })
                        }
    
                    }));
                    setAllToDoFinally(newToDos);
    
                }
            } else {
                console.log("No hay access tokens disponibles.");
            }
        } catch (error) {
            console.error("Error al refrescar los ToDos:", error);
        }
    }
    
    function AllToDoOrganize() {
        const newTodoOrganize: { time: Date[]; text: string[]; name: string[] } = {
            time: [],
            text: [],
            name: [],
        };
        /*
        - Crea una lista de objetos repetidos y ordena la fecha de mayor a menor.
        Ejemplo:
            aaron - hola - 2:44
            aaron - k tal? - 2:43
            Men - Bien. - 2:45
        flatMap:
        La función proporcionada se ejecuta una vez por cada elemento del array original 
        y el valor devuelto por la función se agrega al nuevo array resultante.
        sort:
        Ordena de mayor a menor porque si b - a es un valor positivo, entonces b debería
        ir antes que a.
        Array.isArray:
        Se experimentó un problema, a veces allToDo tenía un valor indefinido, por éso
        no se puede usar el "map". Por éso se agrega comprobantes para ver si esta
        definido.
        */
        if (Array.isArray(allToDo)) {
            const flatItems = allToDo
                .flatMap(item =>
                    Array.isArray(item.TodayDate) ? item.TodayDate.map((date, index) => ({
                        time: new Date(date),
                        text: Array.isArray(item.TodoString) ? item.TodoString[index] : '',
                        name: item.name
                    })) : []
                )
                .sort((a, b) => b.time.getTime() - a.time.getTime());
            
            flatItems.forEach((item) => {
                newTodoOrganize.time.push(item.time);
                newTodoOrganize.text.push(item.text);
                newTodoOrganize.name.push(item.name);
            });
            
            // Actualizar el estado TodoOrganize
            setTodoOrganize(newTodoOrganize);
        } else {
            console.error('allToDo no es un array definido.');
        }
    }
    
    

    useEffect(() => {
        const fetchData = async () => {
            await RefreshToDo();
            setRunCode(true); // Marcar que AllToDoOrganize() se ha ejecutado
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        if (RunCode) {
            AllToDoOrganize();
        }
        
    }, [allToDo, RunCode]);
       
    
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
             TodoOrganize.text.map((text, index) => (
            <div key={index}>{TodoOrganize.name[index]}:   {text} a las {TodoOrganize.time[index].toString()}</div>
            ))
        }
        
        
        </PortalLayout>
    </div>;

}