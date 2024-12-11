const express = require('express');
const router = express.Router();

// Importar las rutas específicas
const authRouter = require('./authRouter'); 
const usersRouter = require('./usersRouter'); 
const plantsRouter = require('./plantsRouter');
const diagnosesRouter = require('./diagnosesRouter');

// Asociar rutas a la API
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/plants', plantsRouter);
router.use('/diagnoses', diagnosesRouter);

module.exports = router;
