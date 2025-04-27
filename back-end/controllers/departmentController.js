const { Department, DepartmentHead, Instructor, Course, Facilitator } = require('../models');

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: DepartmentHead,
          as: 'departmentHead'
        },
        {
          model: Instructor,
          as: 'instructors'
        },
        {
          model: Course,
          as: 'courses'
        },
        {
          model: Facilitator,
          as: 'facilitator'
        }
      ]
    });

    return res.status(200).json({
      count: departments.length,
      data: departments
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: DepartmentHead,
          as: 'departmentHead'
        },
        {
          model: Instructor,
          as: 'instructors'
        },
        {
          model: Course,
          as: 'courses'
        },
        {
          model: Facilitator,
          as: 'facilitator'
        }
      ]
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.status(200).json({
      data: department
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};