// Se importan los hooks useContext, createContext, useState y useEffect de React.
import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
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
    getRefreshToken: () => {}//tmb
})

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
            Se encarga de enviar una solicitud al servidor 
            para REFRESCAR el token de acceso (AccessToken) 
            utilizando un token de actualización (RefreshToken)
                Si todo bien:
                    Devuelve el token de acceso (accessToken)
        getUserInfo 
            Retorna información del usuario.
    */
    useEffect(()=>{},[]);

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
                return json;
                
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
            //El usuario está autenticado
        }else{
            //El usuario NO está autenticado
            const token = getRefreshToken();
            if(token){
                //Si no accessToken, lo actualizo con refreshToken.
                const newAccessToken = await requestNewAccessToken(token);
                if(newAccessToken){
                    //Necesito obtener información del usuario
                    //para éso, otra petición http -> getUserInfo
                    const userInfo = await getUserInfo(newAccessToken);
                    if(userInfo){
                        saveSessionInfo(
                            userInfo, newAccessToken, token
                        );
                    }
                }
            }
        }
    }

    /*
                getAccessToken
    Esta funcion es lo equivalente a un getter en programación orientado a objetos
    Permite que los datos se obtengan de forma segura y controlada:
    De que forma? encapsula los datos, ocultando los detalles de su implementación
    y cómo se calculan dichos valores.
    Los principios de encapsulamiento, abstracción, seguridad y flexibilidad
    */
    function getAccessToken(){
        return accessToken;
    }
    /*
                getRefreshToken
    Si el Token existe, dame su refreshToken.
    */
    function getRefreshToken():string | null{
        const token = localStorage.getItem("token");
        if(token){
            const {refreshToken} = JSON.parse(token);
            return refreshToken;
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

    return <AuthContext.Provider value={{isAuthenticated, getAccessToken, saveUser, getRefreshToken }}>
        {children}
    </AuthContext.Provider>
}

//Vamos a crear un hook que nos permita a acceder a las funciones del useContext
export const useAuth = () => useContext(AuthContext);

