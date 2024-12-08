const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const usersController = require('../controllers/usersController');

router.use(verifyToken);

//rutas privadas
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);

module.exports = router;
