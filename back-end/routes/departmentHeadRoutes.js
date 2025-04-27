const express = require('express');
const router = express.Router();
const departmentHeadController = require('../controllers/departmentHeadController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware.protect);
router.post('/register', authMiddleware.authorize("admin"), departmentHeadController.register);
router.get('/', authMiddleware.authorize("admin"),  departmentHeadController.getAllDepartmentHeads);
router.get('/:id' , authMiddleware.authorize("admin"), departmentHeadController.getDepartmentHead);
router.put('/:id' , authMiddleware.authorize("admin"), departmentHeadController.updateDepartmentHead);
router.delete('/:id' , authMiddleware.authorize("admin"), departmentHeadController.deleteDepartmentHead);

module.exports = router;