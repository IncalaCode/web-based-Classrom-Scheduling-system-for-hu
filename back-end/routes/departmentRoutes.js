const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.protect);

router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartment);

module.exports = router;