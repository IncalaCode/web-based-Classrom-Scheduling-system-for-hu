const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.post(
  '/register', 
  authMiddleware.authorize('departmentHead'),
  instructorController.register
);

router.get(
  '/',
  authMiddleware.authorize('departmentHead'),
  instructorController.getAllInstructors
);

router.get(
  '/:id',
  authMiddleware.authorize('departmentHead'),
  instructorController.getInstructorById
);

router.put(
  '/:id',
  authMiddleware.authorize('departmentHead'),
  instructorController.updateInstructor
);

router.delete(
  '/:id',
  authMiddleware.authorize('departmentHead'),
  instructorController.deleteInstructor
);

module.exports = router;