
const { Instructor, DepartmentHead } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const password  = "instructors123"

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const departmentHead = await DepartmentHead.findOne({ where: { id: req.user.id } });
    if (!departmentHead) {
      return res.status(404).json({ message: 'Department not found for this user' });
    }
    
    const departmentId = departmentHead.departmentId;

    const existingInstructor = await Instructor.findOne({ where: { email } });
    if (existingInstructor) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const instructor = await Instructor.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
      departmentId,
      role: 'instructor'
    });

    const token = jwt.sign(
      { id: instructor.id, role: instructor.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Instructor registered successfully',
      token,
      user: {
        id: instructor.id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        role: instructor.role,
        departmentId: instructor.departmentId
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    if (req.user && req.user.role === 'departmentHead') {
      const departmentHead = await DepartmentHead.findOne({ where: { id: req.user.id } });
      if (!departmentHead) {
        return res.status(404).json({ message: 'Department not found for this user' });
      }
      
      const instructors = await Instructor.findAll({ 
        where: { departmentId: departmentHead.departmentId },
        attributes: { exclude: ['password'] }
      });
      return res.status(200).json({ data : instructors  , count : instructors.length});
    } 
    else {
      return res.status(403).json({ message: 'Unauthorized to view instructors' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instructor = await Instructor.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

  return res.status(200).json({data : instructor});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    
    const instructor = await Instructor.findByPk(id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    if (email && email !== instructor.email) {
      const existingInstructor = await Instructor.findOne({ where: { email } });
      if (existingInstructor) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    await instructor.update({
      firstName: firstName || instructor.firstName,
      lastName: lastName || instructor.lastName,
      email: email || instructor.email
    });
    
    return res.status(200).json({
      message: 'Instructor updated successfully',
      instructor: {
        id: instructor.id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        role: instructor.role,
        departmentId: instructor.departmentId
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instructor = await Instructor.findByPk(id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    await instructor.destroy();
    
    return res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
