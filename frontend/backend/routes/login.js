const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");
const getUserinfo = require("../lib/getUserInfo");

//Con la siguiente función imprimes algo en tu pag
router.post("/", async (req, res)=>{
    const { username, password } = req.body;
    //Si no hay nada en username o name o password
    if(!!!username || !!!password){
        return res.status(400).json(jsonResponse(
            400,{
                error:"Field are required"
            }
            ))
    }
    //findOne busca si existe ese "usuario", registrado en la bd
    const user = await User.findOne({username});
    //Comprueba si user existe
    if(user){
        //password = ingresado y user.password = la contraseña q tengo en la bd.
        const correct = await user.comparePassword(password, user.password);
        //Comprueba si la contraseña es correcta
        if(correct){
            //Autenticar el usuario
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();

            //El user: getUserinfo(user) -> para darle solo el usuario y no otros datos sensibles.
            res.status(200).json(jsonResponse(200, { user: getUserinfo(user), accessToken, refreshToken }));
        }else{
            return res.status(400).json(jsonResponse(400,{error: "User or password incorrect 2"}));
        }
    }else{
        return res.status(400).json(jsonResponse(400,{error: "User or password incorrect 1"}));
    }
});

module.exports = router;
