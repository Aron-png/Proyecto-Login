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
req.body.token = Es el headers, contenido del cuerpo de la solicitud http:
(visto en auth/AuthProvider -> en la función: requestNewAccessToken)...
const response = await fetch(`${API_URL}/refreshToken`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${refreshToken}`,
            },
Pero no podemos hacer ésto, por éso creamos el getTokenFromHeader
Obtenemos el RefreshToken del header de autorizacion.


        auth/verifiTokens:
Vemos que el RefreshToken sea válido, lo decodifica y ven si son iguales.

        auth/generateAccessToken:
Te genera un accessToken a partir del usuario.
    
*/
router.post("/", async (req, res)=>{
    const refreshToken = getTokenFromHeader(req.headers);
    console.log("refresh, ",refreshToken);
    //Extraer el refreshToken del frontend
    if(refreshToken){
        try {
            //findOne: Función para encontrar el refreshToken en la base de datos.
            const found = await Token.findOne({token: refreshToken});
            if(!found){
                //No está autorizado
                return res.status(401).send(jsonResponse(401,{error:"Unauthorized"}))
            }
            //Si encuentro el token, lo decodifica y luego lo compara para ver si son iguales.
            //Si lo son, el refreshToken esta "autenticado".
            
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