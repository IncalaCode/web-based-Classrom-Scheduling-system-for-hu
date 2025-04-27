const express = require('express');
const router = express.Router();
const labAssistantController = require('../controllers/labAssistantController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.post('/register', labAssistantController.register);
router.get('/', authMiddleware.authorize('admin'), labAssistantController.getAllLabAssistants);
router.get('/:id', authMiddleware.authorize('admin'), labAssistantController.getLabAssistant);
router.put('/:id', authMiddleware.authorize('admin'), labAssistantController.updateLabAssistant);
router.delete('/:id', authMiddleware.authorize('admin'), labAssistantController.deleteLabAssistant);

module.exports = router;