const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = 'uploads/manuscripts';
const signatureDir = 'uploads/signatures';

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(signatureDir)) fs.mkdirSync(signatureDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'signature') {
            cb(null, signatureDir);
        } else {
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Basic filter - can be enhanced
    if (file.fieldname === 'signature') {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Signature must be an image'), false);
        }
    }
    // Accept all for manuscript for now (or restrict to pdf/doc)
    cb(null, true);
};

const manuscriptUpload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

module.exports = manuscriptUpload;
