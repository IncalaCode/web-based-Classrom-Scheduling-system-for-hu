const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.post('/register', authMiddleware.authorize('admin'), studentController.register);
router.get('/', authMiddleware.authorize('admin'), studentController.getAllStudents);
router.get('/:id', authMiddleware.authorize('admin'), studentController.getStudent);
router.put('/:id',authMiddleware.authorize('admin'), studentController.updateStudent);
router.delete('/:id', authMiddleware.authorize('admin'), studentController.deleteStudent);

module.exports = router;