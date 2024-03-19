//ÉSta función es utilizada en backend -> routes/refreshToken.js (Ahí lo explica mejor)
//Extraer el RefreshToken del encabezado de autorización de las solicitudes HTTP
function getTokenFromHeader(headers){
    if(headers && headers.authorization){
        const parted = headers.authorization.split(' ');
        if(parted.length === 2){
            return parted[1];//Retornamos nuestro accessToken
        }else{
            return null;
        }
    }else{
        return null;
    }
}
module.exports = getTokenFromHeader;