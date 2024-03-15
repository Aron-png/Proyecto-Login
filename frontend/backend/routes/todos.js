const router = require("express").Router();
const Todo = require("../schema/todo")

router.get("/", async (req, res)=>{
    try {
        const todos = await Todo.find({idUser: req.user.id});
        if(todos){
            res.json(todos);//Vamos a regresar todos los todos
        }else{
            res.status(400).json({error:"No todos found"})
        }
        
    } catch (error) {
        console.log(error);
    }
});

router.post("/", async (req, res)=>{
    //Si no existe un titulo ingresado por el usuario,
    //mandar un error
    if(!req.body.title){
        res.status(400).json({error:"Title is required"})
    }
    try {
        //Guardar en nuevo todo que creemos
        //Necesitamos crear un nuevo Schema
        const todo = new Todo({
            title: req.body.title,
            completed:false,
            idUser: req.user.id,
        });
        const newTodo = await todo.save();
        res.json(newTodo);
    } catch (error) {
        
    }
    
});

module.exports = router;