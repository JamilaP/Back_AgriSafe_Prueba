const express = require('express');
const router = express.Router();
const diseasesController = require('../controllers/plantsController');

// Ruta para obtener todas las enfermedades
router.get('/', diseasesController.getAllDiseases);

// Ruta para obtener detalles de una enfermedad específica
router.get('/:id', diseasesController.getDiseaseById);

module.exports = router;
