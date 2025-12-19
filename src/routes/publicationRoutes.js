const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes
router.post(
    '/',
    authMiddleware,
    roleMiddleware, // Only Admin can publish
    upload.single('pdf_file'),
    publicationController.createPublication
);

router.get('/', publicationController.getAllPublications);
router.get('/:id', publicationController.getPublicationById);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware,
    upload.single('pdf_file'),
    publicationController.updatePublication
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware,
    publicationController.deletePublication
);

module.exports = router;
