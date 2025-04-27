const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.use(authMiddleware.authorize('departmentHead','facilitator','labAssistant','instructor','student'));
router.post('/',  feedbackController.createFeedback);
router.get('/',  feedbackController.getAllFeedbacks);
router.get('/:id',  feedbackController.getFeedbackById);
router.delete('/:id',  feedbackController.deleteFeedback);
router.get('/user/me',  feedbackController.getUserFeedbacks);

module.exports = router;