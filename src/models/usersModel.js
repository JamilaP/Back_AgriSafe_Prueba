const db = require('../config/db');

exports.findByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
};

exports.createUser = async (user) => {
    return await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        user.name,
        user.email,
        user.password
    ]);
};

exports.findAll = () => {
    return db.query('SELECT * FROM users');
};

exports.findById = (id) => {
    return db.query('SELECT * FROM users WHERE user_id = ?', [id]);
};