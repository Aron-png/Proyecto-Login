export interface AuthResponse{
    //Lo estoy mapeando de acuerdo a CÓMO LO TENGO
    //EN LA FUNCIÓN DEL JSON RESPONSE en node.js
    body:{
        user:User;
        accessToken: string;
        refreshToken: string;
    };
}
//Para errores, cómo el usuario es invalido o falta llenar datos.
export interface AuthResponseError{
    body:{
        error:string;
    }
}
//MODELO de usuario
export interface User{
    _id: string;
    name: string;
    username: string;
}