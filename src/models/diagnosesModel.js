const db = require('../config/db');

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

// Obtener todos los diagnósticos por ID de usuario
exports.findByUserId = (userId) => {
  return db.query(
    `SELECT 
      d.diagnosis_id, 
      d.user_id, 
      d.plant_id, 
      d.disease_id, 
      d.image, 
      d.background_removed_image, 
      d.infection_percentage, 
      d.diagnosis_report, 
      d.created_at,
      p.name AS plant_name,
      ds.name AS disease_name,
      ds.description AS disease_description
    FROM diagnoses d
    JOIN plants p ON d.plant_id = p.plant_id
    JOIN diseases ds ON d.disease_id = ds.disease_id
    WHERE d.user_id = ?`,
    [userId]
  );
};

// Obtener un diagnóstico específico por su ID
exports.findById = (diagnosisId) => {
  return db.query(
    `SELECT 
      d.diagnosis_id, 
      d.user_id, 
      d.plant_id, 
      d.disease_id, 
      d.image, 
      d.background_removed_image, 
      d.infection_percentage, 
      d.diagnosis_report, 
      d.created_at,
      p.name AS plant_name,
      ds.name AS disease_name,
      ds.description AS disease_description
    FROM diagnoses d
    JOIN plants p ON d.plant_id = p.plant_id
    JOIN diseases ds ON d.disease_id = ds.disease_id
    WHERE d.diagnosis_id = ?`,
    [diagnosisId]
  );
};


