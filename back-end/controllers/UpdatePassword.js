const { DepartmentHead, Instructor, LabAssistant, Student, Facilitator, Admin } = require('../models');
const bcrypt = require('bcryptjs');

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    let user;
    let model;

    switch (req.user.role) {
        case 'departmenthead':
          model = DepartmentHead;
          break;
        case 'instructor':
          model = Instructor;
          break;
        case 'labassistant':
          model = LabAssistant;
          break;
        case 'student':
          model = Student;
          break;
        case 'facilitator':
          model = Facilitator;
          break;
        case 'admin':
          model = Admin;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }

      user = await model.findByPk(userId); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password' });
    }
    
    user.password = newPassword

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
