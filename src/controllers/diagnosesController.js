const diseasesModel = require('../models/diseasesModel');

// Obtener una lista de todas las enfermedades
exports.getAllDiseases = async (req, res) => {
    try {
        const [diseases] = await diseasesModel.findAll();
        res.status(200).json(diseases);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la lista de enfermedades' });
    }
};

// Obtener detalles de una enfermedad específica
exports.getDiseaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const [disease] = await diseasesModel.findById(id);

        if (!disease.length) {
            return res.status(404).json({ error: 'Enfermedad no encontrada' });
        }

        res.status(200).json(disease[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los datos de la enfermedad' });
    }
};
