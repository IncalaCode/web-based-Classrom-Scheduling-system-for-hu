const { Facilitator } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingFacilitator = await Facilitator.findOne({ where: { email } });
    if (existingFacilitator) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const facilitator = await Facilitator.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
      role: 'facilitator'
    });

    const token = jwt.sign(
      { id: facilitator.id, role: facilitator.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Facilitator registered successfully',
      token,
      user: {
        id: facilitator.id,
        firstName: facilitator.firstName,
        lastName: facilitator.lastName,
        email: facilitator.email,
        role: facilitator.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const facilitator = await Facilitator.findOne({ where: { email } });
    if (!facilitator) {
      return res.status(404).json({ message: 'Facilitator not found' });
    }

    const isPasswordValid = await facilitator.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: facilitator.id, role: facilitator.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: facilitator.id,
        firstName: facilitator.firstName,
        lastName: facilitator.lastName,
        email: facilitator.email,
        role: facilitator.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};