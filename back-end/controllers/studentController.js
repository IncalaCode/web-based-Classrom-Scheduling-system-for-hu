const { Student } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, year, semester, departmentId } = req.body;

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
      departmentId,
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const isPasswordValid = await student.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: student.id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
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