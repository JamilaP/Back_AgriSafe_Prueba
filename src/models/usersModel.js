const db = require('../config/db');

exports.findAll = () => {
    return db.query('SELECT * FROM users');
};

exports.findById = (id) => {
    return db.query('SELECT * FROM users WHERE user_id = ?', [id]);
};

exports.createUser = async (user) => {
    return await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        user.name,
        user.email,
        user.password
    ]);
};