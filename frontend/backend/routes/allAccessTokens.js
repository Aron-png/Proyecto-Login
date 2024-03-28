const express = require('express');
const router = express.Router();
const User = require('../schema/user'); // Modelo de usuario de MongoDB
const Token = require("../schema/token");
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../auth/verifyTokens');
const { generateAccessToken } = require("../auth/generateTokens");
const { jsonResponse } = require("../lib/jsonResponse");

router.get('/', async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);
    
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const found = await Token.findOne({token: refreshToken});
        if(!found){
            //No está autorizado
            return res.status(401).send(jsonResponse(401,{error:"Unauthorized"}))
        }
        //Si encuentro el token, lo decodifica y luego lo compara para ver si son iguales.
        //Si lo son, el refreshToken esta "autenticado".
        const payload = verifyRefreshToken(found.token);
        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Obtener el ID del usuario autenticado desde el token de refresh
        const userId = payload.user.id;
        // Busca a todos los usuarios - busca a todos menos al autenticado
        // El de abajo - .find({ _id: { $ne: userId } });
        const users = await User.find({});

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
