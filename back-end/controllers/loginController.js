const { DepartmentHead, Instructor, LabAssistant, Student, Facilitator, Admin } = require('../models');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    let user;
    let model;
    
    switch (userType) {
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
    
    user = await model.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` });
    }
    
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role , email : user.email , firstName : user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
    
    // Add additional fields for student
    if (userType === 'student') {
      userData.year = user.year;
      userData.semester = user.semester;
    }
    
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.token_refresh = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    let user;
    let model;
    
    switch (decoded.role) {
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
        return res.status(400).json({ success: false, message: "Invalid role in token" });
    }

    user = model.findOne({ where: { id: decoded.id} });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or inactive" });
    }

    if (decoded.exp * 1000 > Date.now()) {
      return res.status(200).json({
        success: true,
        message: "Token is still valid",
        token,
      });
    }

    const newToken = jwt.sign({ id: user.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
