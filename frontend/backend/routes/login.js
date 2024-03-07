const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
//Con la siguiente función imprimes algo en tu pag
router.post("/", (req, res)=>{
    const {UserName, Password} = req.body;
    //Si no hay nada en username o name o password
    if(!!!UserName || !!!Password){
        return res.status(400).json(jsonResponse(
            400,{
                error:"Field are required"
            }
            ))
    }
    //Autenticar el usuario
    const accessToken = "access_token";
    const refreshToken = "refresh_token";
    const user = {
        id: 1,
        name: 'John Doe',
        UserName:'asdf'
    };

    res.status(200).json(jsonResponse(200, { user, accessToken, refreshToken }));
});

module.exports = router;
