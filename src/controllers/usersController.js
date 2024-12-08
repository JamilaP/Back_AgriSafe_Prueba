const usersModel = require('../models/usersModel');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await usersModel.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la ruta
        const [user] = await usersModel.findById(id); // Usar el modelo para buscar por ID

        if (!user.length) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = req.body;
        await usersModel.createUser(user);
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};
