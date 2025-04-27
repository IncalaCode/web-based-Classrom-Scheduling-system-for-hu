const db = require('../models');
const Schedule = db.Schedule;
const Course = db.Course;
const Classroom = db.Classroom;

exports.getAllSchedules = async (req, res) => {
  try {
    const user = req.query.user;
    let model;
    switch(user.toLowerCase()) {
        case 'student':
             model = db.Student;
             break;
        case 'labassistant':
             model = db.LabAssistant;
             break;
        case 'instructor':
            model = db.Instructor;
            break;
        default:
            return res.status(400).json({
            success: false,
            message: 'Invalid user type'
            });
    }
    
    if (!model) {
      return res.status(500).json({
        success: false,
        message: 'Model not found'
      });
    }

    const departmentHead = await model.findByPk(req.user.id);
    
    if (!departmentHead) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const schedules = await Schedule.findAll({
      where: {
        departmentId: departmentHead.departmentId
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