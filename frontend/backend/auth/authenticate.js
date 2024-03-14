const getTokenFromHeader = require("./getTokenFromHeader");
const {verifyAccessToken} = require("./verifyTokens");
const {jsonResponse} = require("../lib/jsonResponse");
function authenticate(req, res, next){
    //Obtener el  token de mi header
    const token = getTokenFromHeader(req.headers);
    //Si existe el token, para sacar info del usuario
    if(token){
        //Si existe el token, vamos a decodificarlo
        const decoded = verifyAccessToken(token);
        
        if(decoded){
            /*
            De todas las solicitudes, solo vamos a mandar el user.js,
            pasa que algunas solicitudes contiene info importante que 
            queremos proteger.
            La sintaxis significa que lo declara como objeto
            */
            
            req.user = { ...decoded.user};
            next();
        }else{
            return res.status(401).json(jsonResponse(401,
                {message: "No token provided"}));
        }
    }else{
        return res.status(401).json(jsonResponse(401,
            {message: "No token provided"}));
    }
}
module.exports = authenticate;