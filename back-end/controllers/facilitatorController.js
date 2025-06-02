
const { Facilitator } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const password =  "facilitator123"

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, FacilitatorName, email } = req.body;

    const existingFacilitator = await Facilitator.findOne({ where: { email } });
    if (existingFacilitator) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const facilitator = await Facilitator.create({
      id: uuidv4(),
      firstName,
      lastName,
      FacilitatorName,
      email,
      password,
      role: 'facilitator'
    });

    return res.status(201).json({
      message: 'Facilitator registered successfully',
      user: {
        id: facilitator.id,
        firstName: facilitator.firstName,
        lastName: facilitator.lastName,
        FacilitatorName: facilitator.FacilitatorName,
        email: facilitator.email,
        role: facilitator.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, FacilitatorName, email, password } = req.body;

    const facilitator = await Facilitator.findByPk(id);
    if (!facilitator) {
      return res.status(404).json({ message: 'Facilitator not found' });
    }

    // If email is being updated, check if it's already in use
    if (email && email !== facilitator.email) {
      const existingFacilitator = await Facilitator.findOne({ where: { email } });
      if (existingFacilitator) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update the facilitator
    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(FacilitatorName && { FacilitatorName }),
      ...(email && { email }),
      ...(password && { password }) // Password will be hashed by the beforeUpdate hook
    };

    await facilitator.update(updateData);

    return res.status(200).json({
      message: 'Facilitator updated successfully',
      user: {
        id: facilitator.id,
        firstName: facilitator.firstName,
        lastName: facilitator.lastName,
        FacilitatorName: facilitator.FacilitatorName,
        email: facilitator.email,
        role: facilitator.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const facilitator = await Facilitator.findByPk(id);
    if (!facilitator) {
      return res.status(404).json({ message: 'Facilitator not found' });
    }



    await facilitator.destroy();

    return res.status(200).json({
      message: 'Facilitator deleted successfully',
      data : []
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getFacilitatorById = async (req, res) => {
  try {
    const { id } = req.params;

    const facilitator = await Facilitator.findByPk(id, {
      include: [{
        association: 'departments',
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] } // Exclude password from the response
    });

    if (!facilitator) {
      return res.status(404).json({ message: 'Facilitator not found' });
    }

    return res.status(200).json({
      data : facilitator
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllFacilitators = async (req, res) => {
  try {
    const facilitators = await Facilitator.findAll({
      include: [{
        association: 'departments',
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']] 
    });

    return res.status(200).json({
      message: 'Facilitators retrieved successfully',
      count: facilitators.length,
      data :facilitators
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
