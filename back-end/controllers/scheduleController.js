const db = require('../models');
const Schedule = db.Schedule;
const Course = db.Course;
const Classroom = db.Classroom;
const Student = db.Student;
const { Op } = require('sequelize');

const formatTimeForMySQL = (timeString) => {
  if (!timeString) return null;
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
    return timeString;
  }
  
  try {
    const date = new Date(timeString);
    return date.toTimeString().split(' ')[0]; 
  } catch (error) {
    console.error('Error formatting time:', error);
    return null;
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { courseId, classroomId, dayOfWeek, startTime, endTime, roomNumber } = req.body;
    const departmentHead = await db.DepartmentHead.findByPk(req.user.id);

    if (!courseId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, dayOfWeek, startTime, and endTime'
      });
    }

    // Format the time values before saving to database
    const formattedStartTime = formatTimeForMySQL(startTime);
    const formattedEndTime = formatTimeForMySQL(endTime);
    
    if (!formattedStartTime || !formattedEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format provided'
      });
    }

    // Check if course exists
    const courseExists = await Course.findByPk(courseId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if classroom exists if provided
    if (classroomId) {
      const classroomExists = await Classroom.findByPk(classroomId);
      if (!classroomExists) {
        return res.status(404).json({
          success: false,
          message: 'Classroom not found'
        });
      }
    }

    try {
      const newSchedule = await Schedule.create({
        courseId,
        classroomId,
        dayOfWeek,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        roomNumber,
        departmentId: departmentHead.departmentId
      });

      return res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: newSchedule
      });
    } catch (error) {
      // If the error is from our conflict check hook
      if (error.message.includes('Schedule conflicts')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message
    });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const departmentHead = await db.DepartmentHead.findByPk(req.user.id);
    const schedules = await Schedule.findAll({
      where: {
        isActive: true,
        departmentId : departmentHead.departmentId
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'code']
        },
        {
          model: Classroom,
          as: 'classroom',
          attributes: ['id', 'building', 'floor', 'roomName', 'capacity']
        }
      ],
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules',
      error: error.message
    });
  }
};

// Get schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const schedule = await Schedule.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'code']
        },
        {
          model: Classroom,
          as: 'classroom',
          attributes: ['id', 'building', 'floor', 'roomName', 'capacity']
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: error.message
    });
  }
};

exports.getSchedulesByStudentGrade = async (req, res) => {
  try {
    // Get student ID from authenticated user
    const studentId = req.user.id;
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Find the student to get their grade
    const student = await Student.findByPk(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const studentGrade = student.grade;
    
    // Find schedules where roomNumber matches student grade
    const schedules = await Schedule.findAll({
      where: {
        roomNumber: studentGrade.toString(), // Convert grade to string to match roomNumber format
        isActive: true
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'Course_name', 'Course_code', 'grade']
        },
        {
          model: Classroom,
          as: 'classroom',
          attributes: ['id', 'building', 'floor', 'roomName', 'capacity']
        }
      ],
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Error fetching schedules by student grade:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules',
      error: error.message
    });
  }
};



// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, classroomId, dayOfWeek, startTime, endTime, roomNumber } = req.body;

    const schedule = await Schedule.findOne({
      where: {
        id,
        isActive: true
      }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Format time values if provided
    const formattedStartTime = startTime ? formatTimeForMySQL(startTime) : null;
    const formattedEndTime = endTime ? formatTimeForMySQL(endTime) : null;
    
    // If time values are provided but invalid, return error
    if ((startTime && !formattedStartTime) || (endTime && !formattedEndTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format provided'
      });
    }

    // If courseId is provided, check if course exists
    if (courseId) {
      const courseExists = await Course.findByPk(courseId);
      if (!courseExists) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
    }

    // If classroomId is provided, check if classroom exists
    if (classroomId) {
      const classroomExists = await Classroom.findByPk(classroomId);
      if (!classroomExists) {
        return res.status(404).json({
          success: false,
          message: 'Classroom not found'
        });
      }
    }

    try {
      await schedule.update({
        courseId: courseId || schedule.courseId,
        classroomId: classroomId !== undefined ? classroomId : schedule.classroomId,
        dayOfWeek: dayOfWeek || schedule.dayOfWeek,
        startTime: formattedStartTime || schedule.startTime,
        endTime: formattedEndTime || schedule.endTime,
        roomNumber: roomNumber !== undefined ? roomNumber : schedule.roomNumber
      });

      return res.status(200).json({
        success: true,
        message: 'Schedule updated successfully',
        data: schedule
      });
    } catch (error) {
      // If the error is from our conflict check hook
      if (error.message.includes('Schedule conflicts')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      throw error;
    }

  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
};

// Delete schedule (soft delete)
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findOne({
      where: {
        id,
        isActive: true
      }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    await schedule.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: error.message
    });
  }
};
