const db = require('../config/db');

// Obtener todos los datos de las enfermedades
exports.findAll = () => {
    return db.query('SELECT * FROM diseases');
};

// Obtener los datos de una enfermedad específica
exports.findById = (id) => {
    return db.query('SELECT * FROM diseases WHERE disease_id = ?', [id]);
};