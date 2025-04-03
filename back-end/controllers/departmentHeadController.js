const { DepartmentHead } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, departmentId } = req.body;

    const existingDepartmentHead = await DepartmentHead.findOne({ where: { email } });
    if (existingDepartmentHead) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const departmentHead = await DepartmentHead.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
      departmentId,
      role: 'departmentHead'
    });

    const token = jwt.sign(
      { id: departmentHead.id, role: departmentHead.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Department Head registered successfully',
      token,
      user: {
        id: departmentHead.id,
        firstName: departmentHead.firstName,
        lastName: departmentHead.lastName,
        email: departmentHead.email,
        role: departmentHead.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const departmentHead = await DepartmentHead.findOne({ where: { email } });
    if (!departmentHead) {
      return res.status(404).json({ message: 'Department Head not found' });
    }

    const isPasswordValid = await departmentHead.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: departmentHead.id, role: departmentHead.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: departmentHead.id,
        firstName: departmentHead.firstName,
        lastName: departmentHead.lastName,
        email: departmentHead.email,
        role: departmentHead.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};