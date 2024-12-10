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

exports.findById = (id) => {
    return db.query('SELECT * FROM users WHERE user_id = ?', [id]);
};

exports.updateProfile = async (userId, name, profilePicture) => {
    const query = `
        UPDATE users
        SET 
            name = COALESCE(?, name), 
            profile_picture = COALESCE(?, profile_picture)
        WHERE user_id = ?
    `;
    return db.query(query, [name, profilePicture, userId]);
};
