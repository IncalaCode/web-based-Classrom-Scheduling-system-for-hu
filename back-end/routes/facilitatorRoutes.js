const express = require('express');
const router = express.Router();
const facilitatorController = require('../controllers/facilitatorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/:id', authorize('admin') ,facilitatorController.getFacilitatorById);
router.get('/', authorize('admin') ,facilitatorController.getAllFacilitators);
router.post('/register', authorize('admin'), facilitatorController.register);
router.put('/:id', authorize('admin'), facilitatorController.update);
router.delete('/:id', authorize('admin'), facilitatorController.delete);

module.exports = router;
