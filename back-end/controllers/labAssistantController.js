const { LabAssistant } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, departmentId } = req.body;

    const existingLabAssistant = await LabAssistant.findOne({ where: { email } });
    if (existingLabAssistant) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const labAssistant = await LabAssistant.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
      departmentId,
      role: 'labAssistant'
    });

    const token = jwt.sign(
      { id: labAssistant.id, role: labAssistant.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Lab Assistant registered successfully',
      token,
      user: {
        id: labAssistant.id,
        firstName: labAssistant.firstName,
        lastName: labAssistant.lastName,
        email: labAssistant.email,
        role: labAssistant.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const labAssistant = await LabAssistant.findOne({ where: { email } });
    if (!labAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    const isPasswordValid = await labAssistant.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: labAssistant.id, role: labAssistant.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: labAssistant.id,
        firstName: labAssistant.firstName,
        lastName: labAssistant.lastName,
        email: labAssistant.email,
        role: labAssistant.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};