const express = require('express');
const { route } = require('./facilitatorRoutes');
const router = express.Router();

router.use("/auth" , require('./authRoutes'))
router.use("/department-heads" , require('./departmentHeadRoutes'))
router.use("/facilitators" , require('./facilitatorRoutes'))
router.use("/students" , require("./studentRoutes"))
router.use("/labAssistants" , require("./labAssistantRoutes"))
router.use("/department" , require("./departmentRoutes"))
router.use("/dashboard" , require("./dashboardRoutes"))
router.use("/instructors" , require("./instructorRoutes"))
router.use("/courses", require("./courseRoutes"))
router.use("/classrooms", require("./classroomRoutes"))
router.use("/schedules", require("./scheduleRoutes"))
router.use("/feedbacks", require("./feedbackRoutes"))
router.use("/users", require("./userRoutes"))
module.exports = router;

