const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.use(authMiddleware.authorize('admin'));

router.get('/admin', dashboardController.getAdminDashboard);

module.exports = router;