const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");

//Con la siguiente función imprimes algo en tu pag
router.post("/", (req, res)=>{
    const { username, name, password } = req.body;
    console.log("Los datos recibidos del frontend", req.body);
    //Si no hay nada en username o name o password
    if(!!!username || !!!name || !!!password){
        return res.status(400).json(jsonResponse(
            400,{
                error:"Field are required"
            }
            ))
    }
    //Si llena todos los campos /  .json() - sirve para exportar una función de otro archivo.
    //Crear usuario en la bd de mongodb
    const user = new User({username, name, password});
    user.save();
    res.status(200).json(jsonResponse(200, { message: "User created successfully" }));
});

module.exports = router;
