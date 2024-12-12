// app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware para procesar JSON
app.use(express.json());

// Rutas principales
app.use('/api', routes);

// Middleware global para errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://10.101.63.228:${PORT}`);
});