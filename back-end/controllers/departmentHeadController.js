const { DepartmentHead, Department } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const password =  "departmentHead123"

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, departmentName ,facilitatorId} = req.body;

    const existingDepartmentHead = await DepartmentHead.findOne({ where: { email } });
    if (existingDepartmentHead) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingDepartment = await Department.findOne({ where: { name: departmentName } });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await Department.create({
      id: uuidv4(),
      name: departmentName,
      facilitatorId: facilitatorId
    });

    const departmentHead = await DepartmentHead.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
      departmentId: department.id,
      role: 'departmentHead'
    });

    return res.status(201).json({
      message: 'Department Head and Department created successfully',
      user: {
        id: departmentHead.id,
        firstName: departmentHead.firstName,
        lastName: departmentHead.lastName,
        email: departmentHead.email,
        role: departmentHead.role,
        department: {
          id: department.id,
          name: department.name
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update department head
exports.updateDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const departmentHead = await DepartmentHead.findByPk(id);
    if (!departmentHead) {
      return res.status(404).json({ message: 'Department Head not found' });
    }

    // Check email uniqueness if email is being updated
    if (email && email !== departmentHead.email) {
      const existingEmail = await DepartmentHead.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await departmentHead.update({
      firstName: firstName || departmentHead.firstName,
      lastName: lastName || departmentHead.lastName,
      email: email || departmentHead.email
    });

    return res.status(200).json({
      message: 'Department Head updated successfully',
      departmentHead: {
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

// Delete department head and associated department
exports.deleteDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;

    const departmentHead = await DepartmentHead.findByPk(id);
    if (!departmentHead) {
      return res.status(404).json({ message: 'Department Head not found' });
    }

    // Get department ID before deleting department head
    const departmentId = departmentHead.departmentId;

    // Delete department head
    await departmentHead.destroy();

    // Delete associated department
    if (departmentId) {
      const department = await Department.findByPk(departmentId);
      if (department) {
        await department.destroy();
      }
    }

    return res.status(200).json({
      message: 'Department Head and associated Department deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get department head by ID
exports.getDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;

    const departmentHead = await DepartmentHead.findByPk(id, {
      include: [{
        model: Department,
        as: 'department'
      }]
    });

    if (!departmentHead) {
      return res.status(404).json({ message: 'Department Head not found' });
    }

    return res.status(200).json({
      data: {
        id: departmentHead.id,
        firstName: departmentHead.firstName,
        lastName: departmentHead.lastName,
        email: departmentHead.email,
        role: departmentHead.role,
        department: departmentHead.department
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all department heads
exports.getAllDepartmentHeads = async (req, res) => {
  try {
    const departmentHeads = await DepartmentHead.findAll({
      include: [{
        model: Department,
        as: 'department'
      }]
    });

    return res.status(200).json({
      count : departmentHeads.length ,
      data : departmentHeads });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { name } = req.body;

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department name already exists
    if (name && name !== department.name) {
      const existingDepartment = await Department.findOne({ where: { name } });
      if (existingDepartment) {
        return res.status(400).json({ message: 'Department name already exists' });
      }
    }

    await department.update({
      name: name || department.name
    });

    return res.status(200).json({
      message: 'Department updated successfully',
      department: {
        id: department.id,
        name: department.name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
