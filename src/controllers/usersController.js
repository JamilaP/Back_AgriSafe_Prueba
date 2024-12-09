const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usersModel = require('../models/usersModel');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si ya existe un usuario con ese correo
        const [existingUser] = await usersModel.findByEmail(email);
        if (existingUser.length) {
            return res.status(400).json({ error: 'Email ya registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        await usersModel.createUser({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por email
        const [user] = await usersModel.findByEmail(email);
        if (!user.length) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const foundUser = user[0];

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { user_id: foundUser.user_id, email: foundUser.email, user: { name: foundUser.name, email: foundUser.email} },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '3h' }
        );

        res.status(200).json({ message: 'Usuario logeado', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al logear el usuario' });
    }
};

exports.protectedEndpoint = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, no se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        console.log('Token decodificado:', decoded);
        res.status(200).json({ message: 'Acceso autorizado', data: decoded });
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

// Obtener datos del usuario logeado
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.user_id; // ID del usuario desde el token JWT
        const [user] = await usersModel.findById(userId);

        if (!user.length) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(user[0]); // Devuelve el perfil del usuario
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }
};

// Actualizar nombre e imagen del perfil del usuario
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.user_id; // ID del usuario desde el token JWT
        const { name } = req.body;
        const profilePicture = req.file ? req.file.location : null; // URL pública de la imagen subida a OBS

        if (!name && !profilePicture) {
            return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }

        // Actualizar los datos en la base de datos
        await usersModel.updateProfile(userId, name, profilePicture);

        res.status(200).json({
            message: 'Perfil actualizado con éxito',
            profilePicture,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};
