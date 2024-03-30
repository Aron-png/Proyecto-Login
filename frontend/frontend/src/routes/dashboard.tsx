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

/*
    useEffect(() => {
        RefreshToDo();
    }, []);
*/
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
    
        // Convierte una lista de objetos en una lista de arrays:
        allToDo.forEach((i) => {
            // Verificar si TodayDate está definido y es un array
            if (Array.isArray(i.TodayDate)) {
                i.TodayDate.forEach((y, index) => {
                    const fechaUTC = new Date(y);
                    newTodoOrganize.time.push(fechaUTC);
                    newTodoOrganize.name.push(i.name);
                    newTodoOrganize.text.push(i.TodoString[index]);
                });
            }
        });
    
        // Crear una copia del array de fechas
        const todoData = [...newTodoOrganize.time];

        // Ordenar el array de fechas de mayor a menor
        todoData.sort((a, b) => b.getTime() - a.getTime());


        newTodoOrganize.time.forEach((item, index) => {
            const changeIndex = todoData.findIndex(data => data.getTime() === item.getTime());
            if(changeIndex !== -1){
                const temp1 = newTodoOrganize.text[index];
                newTodoOrganize.text[index] = newTodoOrganize.text[changeIndex];
                newTodoOrganize.text[changeIndex] = temp1;

                const temp2 = newTodoOrganize.name[index];
                newTodoOrganize.name[index] = newTodoOrganize.name[changeIndex];
                newTodoOrganize.name[changeIndex] = temp2;
            }
        });
        newTodoOrganize.time = todoData;
    
        // Actualizar el estado TodoOrganize
        setTodoOrganize(newTodoOrganize);
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