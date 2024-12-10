const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// Configuración de OBS (Huawei Cloud)
const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.OBS_ENDPOINT), // Endpoint de OBS
    accessKeyId: process.env.OBS_ACCESS_KEY_ID, // Credenciales desde .env
    secretAccessKey: process.env.OBS_SECRET_ACCESS_KEY, // Credenciales desde .env
    s3ForcePathStyle: true, // Obligatorio para OBS
});

// Configuración de Multer con OBS
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.OBS_BUCKET_NAME, // Nombre del bucket
        acl: 'public-read', // Permitir acceso público a las imágenes
        key: (req, file, cb) => {
            const uniqueKey = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueKey); // Nombre del archivo en el bucket
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'));
        }
    },
});

module.exports = upload;
