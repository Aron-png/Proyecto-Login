const express = require('express');
//habilitar la conexión de los dominios de back y front
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
//Algunas rutas deben ser protegidas x el accesstoken.
const authenticate = require('./auth/authenticate');

require('dotenv').config();

const port = process.env.PORT || 3100;
/*Coneccion de bd con la app */
async function main(){
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to mongoDB");
}
main().catch(console.error);
/*Coneccion de bd con la app */

/*Configuracion de rutas: */
app.use(cors());
app.use(express.json());

app.use("/api/signup",require("./routes/signup"));
app.use("/api/user", authenticate, require("./routes/user"));
app.use("/api/login",require("./routes/login"));
app.use("/api/todos", authenticate, require("./routes/todos"));
app.use("/api/refreshToken",require("./routes/refreshToken"));
app.use("/api/signout",require("./routes/signout"));
app.use("/api/allRefreshTokens",require("./routes/allRefreshTokens"));
/*Configuracion de rutas. */

//Con la siguiente función imprimes algo en tu pag
app.get('/', (req, res)=>{
    res.send("El Mini mini");
})

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})
