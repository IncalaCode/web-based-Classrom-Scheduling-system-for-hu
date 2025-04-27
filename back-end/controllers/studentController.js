const { Student, Department } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const password = "student123"

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, year, semester, departmentId } = req.body;

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const student = await Student.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
      year,
      semester,
      departmentId : departmentId[0],
      role: 'student'
    });

    const token = jwt.sign(
      { id: student.id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        year: student.year,
        semester: student.semester,
        role: student.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{
        model: Department,
        as: 'department'
      }],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      data: students,
      count : students.length
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [{
        model: Department,
        as: 'department'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({
      data: student
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, year, semester, departmentId } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ where: { email } });
      if (existingStudent) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await student.update({
      firstName,
      lastName,
      email,
      year,
      semester,
      departmentId :departmentId[0]
    });

    const updatedStudent = await Student.findByPk(id, {
      include: [{
        model: Department,
        as: 'department'
      }],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();

    return res.status(200).json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
