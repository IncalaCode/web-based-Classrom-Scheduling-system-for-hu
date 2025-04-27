const { LabAssistant, Department } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const password = "labAssistant123"

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email , departmentId } = req.body;

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
      departmentId :departmentId[0],
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
        role: labAssistant.role,
        departmentId: labAssistant.departmentId
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllLabAssistants = async (req, res) => {
  try {
    const labAssistants = await LabAssistant.findAll({
      include: [{
        model: Department,
        as: 'department'
      }],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      data: labAssistants,
      count: labAssistants.length
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getLabAssistant = async (req, res) => {
  try {
    const { id } = req.params;

    const labAssistant = await LabAssistant.findByPk(id, {
      include: [{
        model: Department,
        as: 'department'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!labAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    return res.status(200).json({
      data: labAssistant
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateLabAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, departmentId } = req.body;

    const labAssistant = await LabAssistant.findByPk(id);
    if (!labAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    if (email && email !== labAssistant.email) {
      const existingLabAssistant = await LabAssistant.findOne({ where: { email } });
      if (existingLabAssistant) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await labAssistant.update({
      firstName,
      lastName,
      email,
      departmentId :departmentId[0]
    });

    const updatedLabAssistant = await LabAssistant.findByPk(id, {
      include: [{
        model: Department,
        as: 'department'
      }],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      message: 'Lab Assistant updated successfully',
      data: updatedLabAssistant
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteLabAssistant = async (req, res) => {
  try {
    const { id } = req.params;

    const labAssistant = await LabAssistant.findByPk(id);
    if (!labAssistant) {
      return res.status(404).json({ message: 'Lab Assistant not found' });
    }

    await labAssistant.destroy();

    return res.status(200).json({
      message: 'Lab Assistant deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};