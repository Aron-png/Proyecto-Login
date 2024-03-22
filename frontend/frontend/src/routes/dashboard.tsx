import { useEffect, useState } from "react";
import {useAuth} from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import PortalLayout from "../layout/PortalLayout";
interface MyTodo{
    _id: string,
    title: string,
    completed: boolean,
    idUser:string,
    createdAt: Date
}
export default function Dashboard(){
    
    const [todos, setTodos] = useState<MyTodo[]>([]);
    const [title, setTitle] = useState("");
    const auth = useAuth();
    const [TodoOrganize, setTodoOrganize] = useState({
        time: [] as Date[],
        text: [] as string[],
        name: [] as string[]
    });

    useEffect(()=>{
        loadTodos();
    },[auth]);
    useEffect(() => {
        AllToDoOrganize();
        console.log("rpta: ",TodoOrganize);
    }, [todos]);// Actualiza TodoOrganize cuando cambia todos

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
                setTodos([json, ...todos]);
            }
              

        } catch (error) {
            console.error("Error al buscar todos:", error);
        }
        
    }
    //llama los To Do's
    async function loadTodos(){
        try {
            const response = await fetch(`${API_URL}/todos`,{
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${auth.getAccessToken()}`,

                },
            });

            if(response.ok){
                const json = await response.json();
                setTodos(json);
            }
             

        } catch (error) {
            console.error("Error al buscar todos:", error);
        }
        
    }
    
    function quickSort(items:any, left:any, right:any) {
        var index;
        if (left < right) {
            index = partition(items, left, right); //index returned from partition
            quickSort(items, left, index - 1);
            quickSort(items, index, right);
        }
    }
    
    function partition(items:any, left:any, right:any) {
        var pivot   = items[Math.floor((right + left) / 2)].time, //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i].time < pivot) {
                i++;
            }
            while (items[j].time > pivot) {
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
        const newTodoOrganize = {
            time: [] as Date[],
            text: [] as string[],
            name: [] as string[]
        };
    
        // Otros usuarios
        auth.getAllToDoUsers().forEach((i) => {
            i.TodayDate.forEach((y,index) => {
                const fechaUTC = new Date(y);
                newTodoOrganize.time.push(fechaUTC);
                newTodoOrganize.name.push(i.name);
                newTodoOrganize.text.push(i.TodoString[index]);
            });
        });
    
        // MyToDo
        todos.forEach((i)=>{
            const fechaUTC = new Date(i.createdAt);
            newTodoOrganize.time.push(fechaUTC);
            newTodoOrganize.name.push("Tú");
            newTodoOrganize.text.push(i.title);
        });
        // Clonamos el objeto para no modificarlo directamente
        const sortedTodoOrganize = {...newTodoOrganize}; 
        quickSort(sortedTodoOrganize.time, 0, sortedTodoOrganize.time.length - 1);
    
        // Reorganizar los arrays text y name de acuerdo al orden de time
        // indexOf = devulve el indice del elemento que se busca en el []
        sortedTodoOrganize.time.forEach((time, index) => {
            const originalIndex = newTodoOrganize.time.indexOf(time);
            sortedTodoOrganize.text[index] = newTodoOrganize.text[originalIndex];
            sortedTodoOrganize.name[index] = newTodoOrganize.name[originalIndex];
        });
    
        // Actualizar el estado TodoOrganize
        setTodoOrganize(sortedTodoOrganize);
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
        /*
            todos.map((todo, index)=>(
                <div key={index}>Tú: {todo.title} a las {todo.createdAt.toString()}</div>))
        */  TodoOrganize.text.map((text, index) => (
            <div key={index}>{TodoOrganize.name[index]}:  
            {text} a las {TodoOrganize.time[index].toString()}</div>
            ))
        }
        
        
        </PortalLayout>
    </div>;

}