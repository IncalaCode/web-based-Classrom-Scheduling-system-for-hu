const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/schedules', userController.getAllSchedules);

module.exports = router;