const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

const app = express();

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Rutas
app.use('/tareas', require('./Rutas/task'));

//Conexión a BD
mongoose.connect(process.env.BD_CONEXION, {useNewUrlParser:true}, () => {
    console.log('Conectado a la BD');
})

//Puerto para escuchar al servidor
app.listen(3000);
