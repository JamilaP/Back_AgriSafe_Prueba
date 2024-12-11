const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas públicas
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser); 

module.exports = router;