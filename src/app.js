const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/api', routes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
