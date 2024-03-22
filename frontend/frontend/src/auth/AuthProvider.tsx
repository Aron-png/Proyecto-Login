import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User, ToDo } from "../types/types";
import { API_URL } from "./constants";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
    isAuthenticated: boolean;
    getAccessToken: () => string;
    saveUser: (userData: AuthResponse) => void;
    getRefreshToken: () => string | null;
    getUser: () => User | undefined;
    signOut: () => void;
    getAllToDoUsers: () => ToDo[];
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveUser: (userData: AuthResponse) => {},
    getRefreshToken: () => null,
    getUser: () => undefined,
    signOut: () => {},
    getAllToDoUsers: () => [],
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState<User>();
    const [allToDo, setAllToDoFinally] = useState<ToDo[]>([]);

    useEffect(() => {
        checkAuth();
        RefreshToDo();
    }, []);

    async function requestNewAccessToken(refreshToken: string) {
        try {
            const response = await fetch(`${API_URL}/refreshToken`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`,
                },
            });
            if (response.ok) {
                const json = await response.json() as AccessTokenResponse;
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.body.accessToken;

            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getUserInfo(accessToken: string) {
        try {
            const response = await fetch(`${API_URL}/user`, {
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
                return json.body;

            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function checkAuth() {
        const token = getRefreshToken();
        if (token) {
            const newAccessToken = await requestNewAccessToken(token);
            if (newAccessToken) {
                const userInfo = await getUserInfo(newAccessToken);
                if (userInfo) {
                    saveSessionInfo(userInfo, newAccessToken, token);
                }
            }
        }
    }

    function signOut() {
        setAccessToken("");
        setIsAuthenticated(false);
        setUser(undefined);
        localStorage.removeItem("token");
    }

    function getAccessToken() {
        return accessToken;
    }

    function getUser() {
        return user;
    }

    function getAllToDoUsers() {
        return allToDo;
    }

    function getRefreshToken(): string | null {
        return localStorage.getItem("token");
    }

    function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
        setAccessToken(accessToken);
        localStorage.setItem("token", refreshToken);
        setIsAuthenticated(true);
        setUser(userInfo);
    }

    function saveUser(userData: AuthResponse) {
        saveSessionInfo(
            userData.body.user,
            userData.body.accessToken,
            userData.body.refreshToken
        );
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
            const YouRefreshToken: string | null = getRefreshToken();
            if(YouRefreshToken!==null){
                const allAccessToken = await getAllAccessToken(YouRefreshToken!);
                if (allAccessToken.length > 0) {
                    const newToDos: ToDo[] = [];
                    await Promise.all(allAccessToken.map(async (item: string) => {
                    const userName = await getUserInfo(item);//saca el nombre
                    const todos = await getAllToDo(item);//saca el OBJETO To do's
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
            }else {
                console.log("No hay access tokens disponibles.");
            }
        } catch (error) {
            console.error("Error al refrescar los ToDos:", error);
        }
    }
    
    useEffect(() => {
        checkAuth()
            .then(() => setIsLoading(false))
            .catch(() => setIsError(true));
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, signOut, getAllToDoUsers }}>
            {isError ? (
                <div>Error al cargar los datos</div>
            ) : isLoading ? (
                <div>Cargando...</div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

//Vamos a crear un hook que nos permita a acceder a las funciones del useContext
export const useAuth = () => useContext(AuthContext);