const db = require('../config/db');

// Obtener todos los diagnósticos asociados a un usuario a través de la tabla history
exports.findByUserId = (userId) => {
    return db.query(
        `SELECT d.* 
         FROM diagnoses d
         INNER JOIN history h ON d.diagnosis_id = h.diagnosis_id
         WHERE h.user_id = ?`,
        [userId]
    );
};

// Crear un nuevo diagnóstico
exports.create = (diagnosis) => {
  const {
    user_id, plant_id, disease_id, image, background_removed_image,
    infection_percentage, diagnosis_report, created_at,
  } = diagnosis;

  return db.query(
    'INSERT INTO diagnoses (user_id, plant_id, disease_id, image, background_removed_image, infection_percentage, diagnosis_report, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, plant_id, disease_id, image, background_removed_image, infection_percentage, diagnosis_report, created_at]
  );
};


// Eliminar múltiples diagnósticos por una lista de IDs
exports.deleteMultiple = (diagnosisIds) => {
    const placeholders = diagnosisIds.map(() => '?').join(',');
    return db.query(`DELETE FROM diagnoses WHERE diagnosis_id IN (${placeholders})`, diagnosisIds);
};
