import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
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
    getUserInfo: (accessToken: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    getAccessToken: () => "",
    saveUser: () => {},
    getRefreshToken: () => null,
    getUser: () => undefined,
    signOut: () => {},
    getUserInfo: () => Promise.resolve<any>(null),
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState<User>();

    useEffect(() => {
        checkAuth();
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

    
    
    
    useEffect(() => {
        checkAuth()
            .then(() => setIsLoading(false))
            .catch(() => setIsError(true));
        //RefreshToDo();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, signOut, 
        getUserInfo }}>
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