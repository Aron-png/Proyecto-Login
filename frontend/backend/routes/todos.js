const router = require("express").Router();
const Todo = require("../schema/todo")

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find({ idUser: req.user.id ||req.user._id });
        if (!todos || todos.length === 0) {
            
            return res.status(200).json({ mensaje: "No se encontraron To do's para este usuario" });
        }
        res.json(todos); // Devuelve los todos encontrados
    } catch (error) {
        console.error("Error al buscar todos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
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