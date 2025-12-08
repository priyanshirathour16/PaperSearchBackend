const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes here are protected and restricted to admin
router.use(authMiddleware, roleMiddleware);

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

module.exports = router;
