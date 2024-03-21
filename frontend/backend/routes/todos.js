const router = require("express").Router();
const Todo = require("../schema/todo")

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find({ idUser: req.user.id ||req.user._id });
        if (!todos || todos.length === 0) {
            //No se encontraron Todo's para el usuario
            return res.json([]);
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
        const todo = new Todo({
            title: req.body.title,
            completed:false,
            idUser: req.user.id,
            createdAt: Date.now() // Establecer createdAt en la fecha y hora actuales
        });
        const newTodo = await todo.save();
        res.json(newTodo);
    } catch (error) {
        // Manejar cualquier error que ocurra durante la creación de la tarea
        console.error("Error al crear la tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    
});

module.exports = router;