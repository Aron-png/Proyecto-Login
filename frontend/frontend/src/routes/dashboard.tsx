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
        AllToDoOrganize();
    },[]);

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
    
    function swap(items:any, leftIndex:any, rightIndex:any){
            var temp = items[leftIndex];
            items[leftIndex] = items[rightIndex];
            items[rightIndex] = temp;
            var temp2 = TodoOrganize.text[leftIndex];
            var temp3 = TodoOrganize.name[leftIndex];
            TodoOrganize.text[leftIndex] = TodoOrganize.text[rightIndex];
            TodoOrganize.name[leftIndex] = TodoOrganize.name[rightIndex];
            TodoOrganize.text[rightIndex] = temp2;
            TodoOrganize.name[rightIndex] = temp3;
            setTodoOrganize({ ...TodoOrganize }); // Actualiza el estado
    }
    function partition(items:any, left:any, right:any) {
        var pivot   = items[Math.floor((right + left) / 2)], //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i] < pivot) {
                i++;
            }
            while (items[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j); //sawpping two elements
                i++;
                j--;
            }
        }
        return i;
    }
    function quickSort(items:any, left:any, right:any) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                quickSort(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                quickSort(items, index, right);
            }
        }
        return items;
    }
    // first call to quick sort
    function AllToDoOrganize(){
        var item = auth.getAllToDoUsers();
        //Otros usuarios
        item.forEach((i) => {
            i.TodayDate.forEach((y,index) => {
                const fechaUTC = new Date(y);
                TodoOrganize.time.push(fechaUTC);
                TodoOrganize.name.push(i.name);
                TodoOrganize.text.push(i.TodoString[index]);
            });
        });
        //MyToDo
        todos.forEach((i)=>{
            const fechaUTC = new Date(i.createdAt);
            TodoOrganize.time.push(fechaUTC);
            TodoOrganize.name.push("Tú :");
            TodoOrganize.text.push(i.title);

        });
        console.log("1 ", sortedArray);
        console.log("2 ", TodoOrganize);
        var sortedArray = quickSort(TodoOrganize.time, 0, TodoOrganize.time.length - 1);
        
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
            todos.map((todo, index)=>(
                <div key={index}>Tú: {todo.title} a las {todo.createdAt.toString()}</div>))
                
        }
        
        
        </PortalLayout>
    </div>;

}