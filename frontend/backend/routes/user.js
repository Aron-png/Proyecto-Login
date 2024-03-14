const {jsonResponse} = require("../lib/jsonResponse");
const router = require("express").Router();
/*
Éstos son los endpoints que necesitamos para que cuando nos registremos
se mantegan registramos a pesar que actualice la pág. La lógica
se encarga de "auth/AuthProvider" y necesita de 2 peticiones 
    - refreshToken.js
    - user.js
De éste se encarga...
*/
router.get("/", (req, res)=>{
    res.status(200).json(jsonResponse(200,
        req.user));
});

module.exports = router;