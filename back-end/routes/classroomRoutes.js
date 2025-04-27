'use strict';
const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);
router.use(authMiddleware.authorize('facilitator','departmentHead','labAssistant','instructor'));
router.get('/dep', classroomController.getAllClassroomsByDepartment);
router.get('/', classroomController.getAllClassrooms);
router.get('/:id', classroomController.getClassroomById);
router.post('/', classroomController.createClassroom);
router.put('/:id', classroomController.updateClassroom);
router.delete('/:id', classroomController.deleteClassroom);

module.exports = router;