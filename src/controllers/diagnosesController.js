const diagnosesModel = require('../models/diagnosesModel');
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); // Para realizar la descarga de la imagen
const FormData = require('form-data');

const { CLASSIFICATION_API } = process.env;

// Obtener todos los diagnósticos asociados a un usuario
exports.getDiagnosesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const [diagnoses] = await diagnosesModel.findByUserId(userId);

    if (!diagnoses.length) {
      return res.status(404).json({ message: 'No se encontraron diagnósticos para este usuario' });
    }

    res.status(200).json(diagnoses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los diagnósticos del usuario' });
  }
};

// Crear un nuevo diagnóstico
exports.createDiagnosis = async (req, res) => {
  try {
    const { user_id, plant_id, imageUrl } = req.body;

    if (!user_id || !plant_id || !imageUrl) {
      return res.status(400).json({ message: 'Faltan datos obligatorios: user_id, plant_id, imageUrl' });
    }

    // Descarga la imagen desde la URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(400).json({ message: 'No se pudo descargar la imagen desde la URL proporcionada' });
    }
    const imageBuffer = await response.buffer();

    // Crea el objeto FormData para enviar la imagen al API de clasificación
    const formData = new FormData();
    formData.append('file', imageBuffer, 'uploaded_image.jpg'); // Agrega la imagen como archivo

    // Llama al API externo para obtener el diagnóstico
    const diagnosisResult = await axios.post('CLASSIFICATION_API', formData, {
      headers: {
        ...formData.getHeaders(), // Headers generados por FormData
      },
    });

    // Procesa la respuesta del API
    console.log('Resultado del diagnóstico:', diagnosisResult.data);
      
    const { class_number, class_label } = diagnosisResult.data;
    const diagnosis_report = `La imagen fue clasificada como: ${class_label}`;
    const infection_percentage = Math.random() * 100; // Simulación temporal

    // Guarda el diagnóstico en la base de datos
    const diagnosis = {
      user_id,
      plant_id,
      disease_id: class_number || null,
      image: imageUrl,
      background_removed_image: null,
      infection_percentage: infection_percentage.toFixed(2),
      diagnosis_report,
      created_at: new Date(),
    };

    const result = await diagnosesModel.create(diagnosis);

    res.status(201).json({ message: 'Diagnóstico creado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al crear el diagnóstico:', error);
    res.status(500).json({ message: 'Error procesando el diagnóstico', error });
  }
};

// Eliminar múltiples diagnósticos
exports.deleteMultipleDiagnoses = async (req, res) => {
  try {
    const { diagnosisIds } = req.body;

    if (!Array.isArray(diagnosisIds) || diagnosisIds.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar una lista válida de IDs de diagnósticos' });
    }

    const result = await diagnosesModel.deleteMultiple(diagnosisIds);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontraron diagnósticos para eliminar' });
    }

    res.status(200).json({ message: 'Diagnósticos eliminados exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar los diagnósticos' });
  }
};