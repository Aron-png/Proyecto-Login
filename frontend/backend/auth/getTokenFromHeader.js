//Extraer el AccessToken del encabezado de autorización de las solicitudes HTTP
//Tomar  token mandamos el header de autorizacion visto en auth/AuthProvider -> en la función: requestNewAccessToken.
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