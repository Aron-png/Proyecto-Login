const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");

//Con la siguiente función imprimes algo en tu pag
router.post("/", async (req, res)=>{
    const { username, name, password } = req.body;

    //Si no hay nada en username o name o password, no llena todos los campos
    if(!!!username || !!!name || !!!password){
        return res.status(400).json(jsonResponse(
            400,{
                error:"Field are required"
            }
            ))
    }
    
    try {
        /*Crear usuario en la bd de mongodb*/
        const user = new User();
        //usernameExist ya lo hemos definido en el user, verifica si ya existe el username.
        const exists = await user.usernameExist(username);
        if(exists){
            return res.status(400).json(jsonResponse(400,{error:"Username already exists"}))
        }
        const newUser = new User({username, name, password})
        newUser.save();
        /*Crear usuario en la bd de mongodb*/

        //Imprime en consola en la pag web
        //Si llena todos los campos /  .json() - sirve para exportar una función de otro archivo.
        res.status(200).json(jsonResponse(200, { message: "User created successfully" }));
    } catch (error) {
        return res.status(500).json(jsonResponse(500,{error:"Error creating user"}))
    }
    

    
});

module.exports = router;
