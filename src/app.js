const express = require('express');
const cors = require('cors'); // Importa CORS
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:8081', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

// Usa el middleware de CORS
app.use(cors(corsOptions));

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/api', routes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    //console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
