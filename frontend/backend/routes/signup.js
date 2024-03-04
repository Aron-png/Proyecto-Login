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
    //Si llena todos los campos
    res.status(200).jsonResponse(200,{message:"User created successfully"})
});

module.exports = router;
