const express = require('express');
const router = express.Router();
const User = require('../schema/user'); // Modelo de usuario de MongoDB
const Token = require("../schema/token");
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../auth/verifyTokens');
const { generateAccessToken } = require("../auth/generateTokens");

router.get('/', async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);
    
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log("1");
        const found = await Token.findOne({token: refreshToken});
        console.log("2");
        if(!found){
            //No está autorizado
            return res.status(401).send(jsonResponse(401,{error:"Unauthorized"}))
        }
        //Si encuentro el token, lo decodifica y luego lo compara para ver si son iguales.
        //Si lo son, el refreshToken esta "autenticado".
        console.log("3");
        const payload = verifyRefreshToken(found.token);
        console.log("4");
        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log("5");
        // Obtener el ID del usuario autenticado desde el token de refresh
        const userId = payload.user.id;
        console.log("6");
        // Buscar todos los usuarios excepto el usuario autenticado
        const users = await User.find({ _id: { $ne: userId } });

        // Crear un arreglo para almacenar los accessTokens
        const accessTokens = [];
        
        // Generar access tokens para cada usuario encontrado
        for (const user of users) {
            const accessToken = generateAccessToken(user);
            accessTokens.push(accessToken);
        }

        // Devolver los accessTokens como respuesta
        res.json({ accessTokens });

    } catch (error) {
        console.error('Error al obtener los refresh tokens:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
