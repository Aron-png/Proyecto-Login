// Se importan los hooks useContext, createContext, useState y useEffect de React.
import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User, ToDo } from "../types/types";
import { API_URL } from "./constants";

/*
        interface AuthProviderProps
Nuestro componente que valida constantemente para verificar si puede
acceder a la información (entrar a una pág se te registrastes); 
normalmente enviada por el backend.
*/

interface AuthProviderProps{
    children: React.ReactNode;
}

//      AuthContext
// Este contexto se utiliza para almacenar información sobre 
// el estado de autenticación del usuario actual. 
// Además, se lamacena los métodos del objeto.
const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},//definido como objeto
    saveUser: (userData: AuthResponse) => {},//tmb
    getRefreshToken: () => {},
    //Puede devolver User o indefinido, visto en types
    getUser: () => ({} as User|undefined),
    signOut: () => {},
    getAllToDoUsers: () => {},
})

// Define el tipo para el array de ToDos
/*
type ToDo = {
    name: string;
    TodoString: string;
  }
*/

//      AuthProvider
/*
Se define un componente AuthProvider que recibe una prop children. 
Esta prop representa el contenido del componente que se envolverá 
con el contexto de autenticación.

Dentro del componente AuthProvider, se define un estado 
isAuthenticated usando el hook useState. Este estado se utiliza 
para almacenar el estado de autenticación actual del usuario.

El componente AuthProvider devuelve un proveedor de contexto 
AuthContext.Provider. 
<<IMPORTANTE: El proveedor de contexto proporciona el 
valor actual de isAuthenticated a sus hijos.>>
*/
export function AuthProvider({children}:AuthProviderProps){
    //Puedo entrar a la pág sin usar login? False = isAuthenticated
    const [isAuthenticated, setisAuthenticated] = useState(false);
    
    const [accessToken, setaccessToken] = useState<string>("");
        //user = Si te has pasado el login, guarda la info del usuario
    const [user, setUser] = useState<User>();
        //Si está cargando la página, mostrar un ícono de "cargando"
    const [isLoading, setIsLoading] = useState(true);
    const [allToDo, setAllToDoFinally] = useState<ToDo[]>([]);
    /*
    ¿Por qué cada vez que el usuario se ah registrado, 
    se pierde con cada actualizar página?
    Necesitamos de una función que verifique que el usuario
    ya se ah registrado = autenticado. 
        
        Cuando tenemos un AccessToken en memoria significa 
        que el usuario está autenticado. Si no lo tiene,
        significa que el accessToken ha vencido y necesitamos 
        del refreshToken para  acceder al info del usuario 
        sin registrarse. Por ende,
                
        refreshNewAccessToken
            Si el Token No existe en el localStorage,
            se encarga de enviar una solicitud al servidor 
            para REFRESCAR el token de acceso (AccessToken) 
            utilizando un token de actualización (RefreshToken)
                Si todo bien:
                    Devuelve el token de acceso (accessToken)
            En resumen, se utiliza para obtener un nuevo 
            accessToken utilizando el refreshToken.
        getUserInfo 
            Retorna información del usuario.
    */
    useEffect(()=>{
        checkAuth();//Ésto va primero
        RefreshToDo();//Llama a los To Do's de los demás usuarios
    },[]);

    async function requestNewAccessToken(refreshToken: String){
        try {
            const response = await fetch(`${API_URL}/refreshToken`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${refreshToken}`,
                },
            });
            if(response.ok){
                const json = await  response.json() as AccessTokenResponse;
                if(json.error){
                    throw new Error(json.error);
                }
                return json.body.accessToken;
                
            }else{
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }   
    
    async function getUserInfo(accessToken:string) {
        try {
            const response = await fetch(`${API_URL}/user`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${accessToken}`,
                },
            });
            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json.body;
                
            }else{
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    /*
            checkAuth
    Verifica si tienes un accessToken guardado, para ver si te has
    registrado.
    */
    async function checkAuth(){
        
        if(accessToken){
            //El usuario está autenticado o registrado en login
            const userInfo = await getUserInfo(accessToken);
            if(userInfo){
                setIsLoading(false);
                //"!" indica que la función nunca devolverá un valor
                //null o undefined
                saveSessionInfo(userInfo, accessToken, getRefreshToken()!);
                return;
            }
        }else{
            //El usuario NO está autenticado o registrado en login
            //Ahora pediré el refreshtoken para luego
            //obtener el accessToken a partir del requestNewAccessToken(token)
            const token = getRefreshToken();
            if(token){
                //Si no hay accessToken, lo actualizo con requestNewAccessToken
                const newAccessToken = await requestNewAccessToken(token);
                if(newAccessToken){
                    //Necesito obtener información del usuario
                    //para éso, otra petición http -> getUserInfo
                    const userInfo = await getUserInfo(newAccessToken);
                    if(userInfo){
                        
                        setIsLoading(false);
                        saveSessionInfo(userInfo, newAccessToken, token);
                        return;
                    }
                }
            }
        }
        setIsLoading(false);
    }
    //Método para cerrar sesión
    function signOut(){
        setaccessToken("");//Ya no tenemos el accessToken
        setisAuthenticated(false);//Ya no estamos autenticados
        setUser(undefined);
        localStorage.removeItem("token");//Eliminar nuestro token del localStorage
    }

    /*
    Esta funcion es lo equivalente a un getter en programación orientado a objetos
    Permite que los datos se obtengan de forma segura y controlada:
    De que forma? encapsula los datos, ocultando los detalles de su implementación
    y cómo se calculan dichos valores.
    Los principios de encapsulamiento, abstracción, seguridad y flexibilidad.
    Ésto es útil si queremos info que vamos a utilizar de otro lado, x ejem:
    El routes/dashboard necesitamos pintar el nombre del usuario y el accessToken
    para llamadas http y todos los Todo's de los usuarios: 
        getAccessToken, getUser y getAllToDoUsers
    
    */
    function getAccessToken(){
        return accessToken;
    }
    function getUser(){
        return user;
       }
    function getAllToDoUsers(){
        return allToDo;
    }
    /*
                getRefreshToken
    Si el Token existe en el localStorage, dame su refreshToken.
    */
    function getRefreshToken():string | null{
        const tokenData = localStorage.getItem("token");
        if(tokenData){
            const token = JSON.parse(tokenData);//Pasarlo a JSON
            return token;
        }
        return null;
    }
    /*
                saveSessionInfo
    -   Guardar info del accessToken, mantenerlo en memoria,
        solo existira mientra la pc esté prendido.
    -   Guardar info del refreshToken, con un localStorage.
    -   Puedo entrar a la pág sin usar login? True xq ya te has registrado antes
    -   Guardar información del usuario.
    
    Ésta función se utiliza en saveUser y en checkAuth xq son la misma comprobación
    pero diferentes tipo de datos de entrada.
    */
    function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string){
        setaccessToken(accessToken);
        localStorage.setItem("token",JSON.stringify(refreshToken));
        setisAuthenticated(true);
        setUser(userInfo);
    }
    function saveUser(userData: AuthResponse){
        saveSessionInfo(
            userData.body.user,
            userData.body.accessToken,
            userData.body.refreshToken
        );
    }
   /*
        Recoger los To do's de otros usuarios por orden:
   */
    //Retorna los accessTokens de los demás usuarios
    async function getAllAccessToken(refreshToken: String) {
        try {
            const response = await fetch(`${API_URL}/allAccessTokens`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${refreshToken}`,
                },
            });
            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json.accessTokens;
                
            }else{
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    //Retorna los To do's de los demás usuarios
    async function getAllToDo(accessToken:string) {
        try {
            const response = await fetch(`${API_URL}/todos`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${accessToken}`,
                },
            });
            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json;
                
            }else{
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    //  Conecta los getAllToDo y getAllAccessToken para retornar los ToDo's
    //  Función asincrónica para refrescar los ToDos de los otros usuarios
  async function RefreshToDo() {
    try {
      // Obtiene todos los refresh tokens y sus datos asociados
      const YouRefreshToken:string | null = getRefreshToken()
      const allAccessToken = await getAllAccessToken(YouRefreshToken!);
      
      // Verifica que hayan access tokens disponibles
      if (allAccessToken.length > 0) {
        const newToDos: ToDo[] = [];
        // Itera sobre cada access token y obtiene los ToDos asociados
        await Promise.all(allAccessToken.map(async (item: string) => {

            const userName= await getUserInfo(item);//saca el nombre
            const todos = await getAllToDo(item);//saca el OBJETO To do's
            console.log("1",todos)
            if(Array.isArray(todos)){
                newToDos.push({
                    name:   userName.name,
                    TodoString: todos.map((obj: { title: string }) => obj.title),
                    TodayDate: todos.map((obj: { createdAt: Date }) => obj.createdAt)
                    //map: recorre el objeto To Do y llama al "title"
                    //porque ahí se encuentra el string del usuario
                  })
            }
            
        }));
        // Actualiza el estado con los nuevos ToDos obtenidos
        setAllToDoFinally(newToDos);
        console.log("2",newToDos)
      } else {
        console.log("No hay access tokens disponibles.");
      }
    } catch (error) {
      console.error("Error al refrescar los ToDos:", error);
    }
  }
   //Retornamos la funciones y varaibles q necesitemos
    return <AuthContext.Provider value={{isAuthenticated, getAccessToken, saveUser, 
    getRefreshToken, getUser, signOut, getAllToDoUsers }}>
        {
            //Lógica para saber si está cargando, mostrar una pestaña de cargando.
        }
        {isLoading ? <div>Loading... </div> : children}
    </AuthContext.Provider>
}

//Vamos a crear un hook que nos permita a acceder a las funciones del useContext
export const useAuth = () => useContext(AuthContext);

