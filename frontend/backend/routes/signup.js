const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
//Con la siguiente función imprimes algo en tu pag
router.post("/", (req, res)=>{
    const {UserName, Name, Password} = req.body;
    //Si no hay nada en username o name o password
    if(!!!UserName || !!!Name || !!!Password){
        return res.status(400).json(jsonResponse(
            400,{
                error:"Field are required"
            }
            ))
    }
    //Si llena todos los campos /  .json() - sirve para exportar de otro archivo
    //El método jsonResponse no es una función del objeto res, 
    //sino una función independiente que exportas desde otro archivo. 
    res.status(200).json(jsonResponse(200, { message: "User created successfully" }));
});

module.exports = router;
