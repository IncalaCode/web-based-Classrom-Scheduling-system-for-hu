const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware.protect);
router.post('/',   authMiddleware.authorize('departmentHead' ), courseController.createCourse);
router.get('/',  authMiddleware.authorize('departmentHead'),  courseController.getMyDepartmentCourses);
router.get('/:id',   authMiddleware.authorize('departmentHead'), courseController.getCourseById);
router.put('/:id',   authMiddleware.authorize('departmentHead'), courseController.updateCourse);
router.delete('/:id',   authMiddleware.authorize('departmentHead'), courseController.deleteCourse);
// router.get('/department/:departmentId',   authMiddleware.authorize('departmentHead'), courseController.getCoursesByDepartment);

module.exports = router;