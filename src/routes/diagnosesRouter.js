const express = require('express');
const diagnosesController = require('../controllers/diagnosesController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Ruta para obtener todos los diagnósticos asociados a un usuario
router.get('/user/:userId', diagnosesController.getDiagnosesByUserId);

// Ruta para crear un nuevo diagnóstico (incluye el manejo de imágenes)
router.post('/', upload.single('image'), diagnosesController.createDiagnosis);

// Ruta para eliminar múltiples diagnósticos
router.delete('/', diagnosesController.deleteMultipleDiagnoses);

module.exports = router;
