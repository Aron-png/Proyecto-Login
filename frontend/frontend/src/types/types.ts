//                          EXPLICACIÓN
//La clases son como los moldes que dan forma los objetos
//Pero ésta es una interfaz y es una especificación de un conjunto 
//de métodos que una clase debe implementar.
//       Lo usamos en auth/AuthProvider, ve las librerias.
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
export interface AccessTokenResponse{
    statusCode: number;
    body:{
        accessToken: string;
    },
    error?: string;
}
export interface ToDo{
    name: string;
    TodoString: string[];
    TodayDate: Date[];
}