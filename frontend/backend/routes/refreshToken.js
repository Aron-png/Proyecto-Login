const { generateAccessToken } = require("../auth/generateTokens");
const {verifyRefreshToken} = require("../auth/verifyTokens")
const getTokenFromHeader = require("../auth/getTokenFromHeader");
const { jsonResponse } = require("../lib/jsonResponse");
const Token = require("../schema/token");
const router = require("express").Router();
/*
Éstos son los endpoints que necesitamos para que cuando nos registremos
se mantegan registramos a pesar que actualice la pág. La lógica
se encarga de "auth/AuthProvider" y necesita de 2 peticiones 
    - refreshToken.js
    - user.js
Del refreshToken se encarga de...

    auth/getTokenFromHeader:
Nosotros vamos a necesitar el token mandamos el header de autorizacion visto
en auth/AuthProvider -> en la función: requestNewAccessToken. 

    función del refreshToken -> findOne({token: refreshToken}):
Luego, buscamos el token dentro de la base de datos

    auth/verifiTokens:
Finalmente, tenemos que ver si el token es válido, lo decodifica y ven si son iguales
    
*/
router.post("/", async (req, res)=>{
    const refreshToken = getTokenFromHeader(req.headers);
    //Existe un refreshToken en la bd?
    if(refreshToken){
        try {
            //Función para encontrar el refreshToken en la base de datos.
            const found = await Token.findOne({token: refreshToken});
            if(!found){
                //No está autorizado
                return res.status(401).send(jsonResponse(401,{error:"Unauthorized"}))
            }
            //Si encuentro el token, ahora verificará que ése token sea válido
            const payload = verifyRefreshToken(found.token);
            if(payload){
                const accessToken = generateAccessToken(payload.user);
                return res.status(200).json(jsonResponse(200,{accessToken}))
            }else{
                return res.status(401).send(jsonResponse(401,{error:"Unauthorized"}))
            }
            
        } catch (error) {
            return res.status(401).send(jsonResponse(401,{error:"Unauthorized"}))
        }
    }else{
        res.status(401).send(jsonResponse(401,{error: "Unauthorized"}));
    }
    
});

module.exports = router;