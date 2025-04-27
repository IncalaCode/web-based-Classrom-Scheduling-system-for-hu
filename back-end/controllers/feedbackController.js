const db = require('../models');
const Feedback = db.Feedback;
const Department = db.Department;
const Course = db.Course;
const Schedule = db.Schedule;

exports.createFeedback = async (req, res) => {
  try {
    const { 
      title, 
      content,  
      scheduleId, 
      priority 
    } = req.body;
    
    const user = req.user;
    
    if (!user || !user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    let model;
    switch(user.role.toLowerCase()) {
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


    const userRecord = await model.findByPk(user.id);
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: 'User record not found'
      });
    }
  
    if (scheduleId) {
      const schedule = await Schedule.findByPk(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
    }
    
    
    const feedback = await Feedback.create({
      title,
      content,
      departmentId: userRecord.departmentId,
      scheduleId: scheduleId || null,
      courseId: null,
      senderId: user.id,
      senderType: user.role,
      priority: priority || 'medium',
      status: 'pending'
    });
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user || !user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    let model;
    switch(user.role.toLowerCase()) {
      case 'departmenthead':
        model = db.DepartmentHead;
        break;
      default:
        return res.status(403).json({
          success: false,
          message: 'Only department heads can access all feedbacks'
        });
    }
    
    const departmentHead = await model.findByPk(user.id);
    if (!departmentHead) {
      return res.status(404).json({ message: 'Department head not found' });
    }
    
    const { count, rows: feedbacks } = await Feedback.findAndCountAll({
      where: {
        departmentId: departmentHead.departmentId,
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count,
      data : feedbacks
    });
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    res.status(500).json({
      message: 'Failed to retrieve feedbacks',
      error: error.message
    });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByPk(id, {
      include: [
        { model: Department, as: 'department' },
        { model: Course, as: 'course' },
        { model: Schedule, as: 'schedule' }
      ]
    });
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json({
      message: 'Feedback retrieved successfully',
      feedback
    });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({
      message: 'Failed to retrieve feedback',
      error: error.message
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    if (!user || !user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const feedback = await Feedback.findOne({
      where: {
        id,
        senderId: user.id,
        senderType: user.role
      }
    });
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found or you do not have permission to delete it'
      });
    }
    
    await feedback.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

exports.getUserFeedbacks = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user || !user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const { count, rows: feedbacks } = await Feedback.findAndCountAll({
      where: {
        senderId: user.id,
        senderType: user.role
      },
      limit: parseInt(limit),
      offset: offset,
      include: [
        { model: Department, as: 'department' },
        { model: Course, as: 'course' },
        { model: Schedule, as: 'schedule' }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      message: 'User feedbacks retrieved successfully',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      feedbacks
    });
  } catch (error) {
    console.error('Error retrieving user feedbacks:', error);
    res.status(500).json({
      message: 'Failed to retrieve user feedbacks',
      error: error.message
    });
  }
};
