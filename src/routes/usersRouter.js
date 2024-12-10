const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const usersController = require('../controllers/usersController');
const upload = require('../middlewares/upload');

router.use(verifyToken);

//rutas privadas
router.get('/:id', usersController.getUserProfile);
router.post('/', usersController.createUser);
router.get('/profile', usersController.getUserProfile);
router.put('/profile', upload.single('profile_picture'), usersController.updateUserProfile);

module.exports = router;
