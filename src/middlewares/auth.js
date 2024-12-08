exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    // Aquí puedes agregar lógica para validar el token
    next();
};
