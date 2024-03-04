const express = require('express');
const cors = require('cors');//habilitar la conexión de los dominios de back y front
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 3100;

/*Configuracion de rutas: */
app.use(cors());
app.use(express.json());

app.use("/api/signup",require("./routes/signup"));
app.use("/api/user",require("./routes/user"));
app.use("/api/login",require("./routes/login"));
app.use("/api/todos",require("./routes/todos"));
app.use("/api/refreshToken",require("./routes/refreshToken"));
app.use("/api/signout",require("./routes/signout"));
/*Configuracion de rutas. */

//Con la siguiente función imprimes algo en tu pag
app.get('/', (req, res)=>{
    res.send("El Mini mini");
})

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})
