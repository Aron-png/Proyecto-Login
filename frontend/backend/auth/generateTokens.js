const jwt = require("jsonwebtoken");
//¿Qué hace?
//Nos da un token = si el accesstoken venció, nos dará el refreshToken.
function sign(payload, isAccessToken){
    //Acá tenemos una función donde debe recibir el refresh ó el access token
    //según la situación, isAccessToken verifica si tiene el AccessToken
    return jwt.sign(payload, 
        isAccessToken? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: 3600,//Duración del Token
            algorithm: "HS256",
        }
        )
/*
El accessToken (realiza las solicitudes http) dura menos que el refresh. Puede ser días 
o semanas dependiendo de cuánto tiempo quieres que esté logeado el usuario
*/
}
function generateAccessToken(user){
    //Voy a llamar a user, pero lo voy a descomponer en un arreglo.
    return sign({user},true);
}
function generateRefreshToken(user){
    return sign({user},false);
}
module.exports = {generateAccessToken, generateRefreshToken};