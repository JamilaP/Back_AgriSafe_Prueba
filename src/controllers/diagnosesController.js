const diagnosesModel = require('../models/diagnosesModel');
const axios = require('axios');
const fetch = require('node-fetch'); // Para realizar la descarga de la imagen
const FormData = require('form-data');

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
    formData.append('file', imageBuffer, 'uploaded_image.jpg');

    // Llama al API externo para obtener el diagnóstico de detección de la roya en la imagen
    const classificationResult = await axios.post(process.env.CLASSIFICATION_API, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log(classificationResult.data);

    const { class_number, class_label } = classificationResult.data;
    let diagnosis_report = `La imagen fue clasificada como: ${class_label}`;
    let severity_percentage = 0;
    let severity_grade = 0;
    let description = "El maíz no presenta la enfermedad de la roya";

    // Solo ejecuta la segmentación si class_number es 1
    if (class_number === 1) {
      // Crea un nuevo FormData para la segmentación
      const formData2 = new FormData();
      formData2.append('file', imageBuffer, 'uploaded_image.jpg');

      const segmentationResult = await axios.post(process.env.SEGMENTATION_API, formData2, {
        headers: {
          ...formData2.getHeaders(),
        },
      });

      console.log(segmentationResult.data);

      // Extrae los valores de segmentación
      severity_percentage = segmentationResult.data.severity_percentage;
      severity_grade = segmentationResult.data.severity_grade;
      description = segmentationResult.data.description;

      diagnosis_report += ` con un grado de severidad de ${severity_grade} y un porcentaje (${severity_percentage.toFixed(2)}%). ${description}`;
    } else {
      // Agrega información adicional si no hay roya
      diagnosis_report += `. ${description}`;
    }

    // Guarda el diagnóstico en la base de datos
    const diagnosis = {
      user_id,
      plant_id,
      disease_id: class_number,
      image: imageUrl,
      background_removed_image: severity_grade.toString(),
      infection_percentage: severity_percentage.toFixed(2),
      diagnosis_report,
      created_at: new Date(),
    };

    const result = await diagnosesModel.create(diagnosis);

    res.status(201).json({ 
      message: 'Diagnóstico creado exitosamente',
      id: result.insertId,
      disease_id: diagnosis.disease_id,
      infection_percentage: diagnosis.infection_percentage,
      background_removed_image: diagnosis.background_removed_image
    });
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
