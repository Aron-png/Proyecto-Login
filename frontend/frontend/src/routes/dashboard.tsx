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
    
    function quickSort(items:any, left:any, right:any) {
        var index;
        if (left < right) {
            index = partition(items, left, right); //index returned from partition
            quickSort(items, left, index - 1);
            quickSort(items, index + 1, right);//CAMBIO index
        }
        return items;
    }
    
    function partition(items:any, left:any, right:any) {
        var pivot   = items[Math.floor((right + left) / 2)].time, //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i].time > pivot) {//CAMBIO <
                i++;
            }
            while (items[j].time < pivot) {//CAMBIO >
                j--;
            }
            if (i <= j) {
                swap(items, i, j); //swapping two elements
                i++;
                j--;
            }
        }
        return i;
    }
    
    function swap(items:any, leftIndex:any, rightIndex:any) {
        var temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    }
    
    function AllToDoOrganize() {
        const newTodoOrganize: { time: Date[]; text: string[]; name: string[] } = {
            time: [],
            text: [],
            name: [],
        };
    
        // Otros usuarios
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
    
        // Crear un nuevo array de objetos con los datos asociados
        const todoData = newTodoOrganize.time.map((time, index) => ({
            time,
            name: newTodoOrganize.name[index],
            text: newTodoOrganize.text[index],
        }));
    
        // Ordenar el array de objetos por tiempo (de mayor a menor)
        todoData.sort((a, b) => b.time.getTime() - a.time.getTime());
    
        // Actualizar el estado TodoOrganize con los datos ordenados correctamente
        const sortedTodoOrganize = {
            time: todoData.map((data) => data.time),
            name: todoData.map((data) => data.name),
            text: todoData.map((data) => data.text),
        };
    
        // Actualizar el estado TodoOrganize
        setTodoOrganize(sortedTodoOrganize);
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
    
    console.log("rpta 2: ",TodoOrganize);
     
    
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