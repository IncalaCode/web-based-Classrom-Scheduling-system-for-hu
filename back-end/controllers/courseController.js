const { Course, Department ,DepartmentHead } = require('../models');


exports.createCourse = async (req, res) => {
  try {
    // Get the department head based on the authenticated user
    const departmentHead = await DepartmentHead.findByPk(req.user.id);
    
    if (!departmentHead) {
      return res.status(403).json({
        status: 'fail',
        message: 'Only department heads can create courses'
      });
    }

    // Get the department associated with the department head
    const department = await Department.findByPk(departmentHead.departmentId);
    if (!department) {
      return res.status(404).json({
        status: 'fail',
        message: 'Department not found'
      });
    }

    // Add the department ID to the request body
    const courseData = {
      ...req.body,
      departmentId: departmentHead.departmentId
    };

    const course = await Course.create(courseData);
    
    return res.status(201).json({
      status: 'success',
      data: course,
     
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Department,
          as: 'department'
        }
      ]
    });
    
    return res.status(200).json({
      status: 'success',
      count: courses.length,
      data: courses,
      count : course.length || 0

    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          as: 'department'
        }
      ]
    });
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: course
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    // Get the department head based on the authenticated user
    const departmentHead = await DepartmentHead.findByPk(req.user.id);
    
    if (!departmentHead) {
      return res.status(403).json({
        status: 'fail',
        message: 'Only department heads can update courses'
      });
    }

    const course = await Course.findByPk(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    // Ensure the course belongs to the department head's department
    if (course.departmentId !== departmentHead.departmentId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update courses in your department'
      });
    }
    
    // Don't allow changing the department
    const updateData = { ...req.body };
    delete updateData.departmentId;
    
    await course.update(updateData);
    
    return res.status(200).json({
      status: 'success',
      data: course
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    // Get the department head based on the authenticated user
    const departmentHead = await DepartmentHead.findByPk(req.user.id);
    
    if (!departmentHead) {
      return res.status(403).json({
        status: 'fail',
        message: 'Only department heads can delete courses'
      });
    }

    const course = await Course.findByPk(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }
    
    // Ensure the course belongs to the department head's department
    if (course.departmentId !== departmentHead.departmentId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete courses in your department'
      });
    }
    
    await course.destroy();
    
    return res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get courses by department
exports.getCoursesByDepartment = async (req, res) => {
  try {
    // If departmentId is provided in params, use it
    let departmentId = req.params.departmentId;
    
    // If no departmentId in params, try to get it from the authenticated department head
    if (!departmentId) {
      const departmentHead = await DepartmentHead.findByPk(req.user.id);
      if (departmentHead) {
        departmentId = departmentHead.departmentId;
      }
    }
    
    if (!departmentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Department ID is required'
      });
    }
    
    // Check if department exists
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({
        status: 'fail',
        message: 'Department not found'
      });
    }
    
    const courses = await Course.findAll({
      where: { departmentId },
      include: [
        {
          model: Department,
          as: 'department'
        }
      ]
    });
    
    return res.status(200).json({
      status: 'success',
      results: courses.length,
      data: courses
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get courses for the department head's department
exports.getMyDepartmentCourses = async (req, res) => {
  try {
    const departmentHead = await DepartmentHead.findByPk(req.user.id);
    
    if (!departmentHead) {
      return res.status(403).json({
        status: 'fail',
        message: 'Only department heads can access this endpoint'
      });
    }
    
    const courses = await Course.findAll({
      where: { departmentId: departmentHead.departmentId },
      include: [
        {
          model: Department,
          as: 'department'
        }
      ]
    });
    
    return res.status(200).json({
      status: 'success',
      results: courses.length,
      data: courses
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
