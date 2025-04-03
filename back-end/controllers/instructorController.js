const { Instructor } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, departmentId } = req.body;

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
        role: instructor.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const instructor = await Instructor.findOne({ where: { email } });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const isPasswordValid = await instructor.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: instructor.id, role: instructor.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: instructor.id,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        role: instructor.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};