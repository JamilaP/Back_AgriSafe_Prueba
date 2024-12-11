const express = require('express');
const cors = require('cors'); // Importa CORS
const routes = require('./routes');
require('dotenv').config();
//require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Usa el middleware de CORS
app.use(cors(corsOptions));

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/api', routes);

// Middleware para subir imagenes
app.use('/uploads', express.static('uploads'));

// Middleware global para errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
