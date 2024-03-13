const jwt = require("jsonwebtoken");
//Necesitamos una función para cada token porque no son el mismo objeto.
//Ésta función verifica si los tokens son iguales, antes de éso lo decodificamos.
function verifyAccessToken(token){
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token){
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}
module.exports = {verifyAccessToken, verifyRefreshToken};