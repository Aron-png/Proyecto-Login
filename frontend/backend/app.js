const express = require('express');
const cors = require('cors');//habilitar la conexión de los dominios de back y front
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send("Mini mini");
})

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})
