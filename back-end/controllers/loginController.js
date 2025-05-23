const { DepartmentHead, Instructor, LabAssistant, Student, Facilitator, Admin } = require('../models');
const jwt = require('jsonwebtoken');

// Helper function to find user by email in all models
async function findUserByEmail(email) {
  const models = [
    { model: DepartmentHead, role: 'departmenthead' },
    { model: Instructor, role: 'instructor' },
    { model: LabAssistant, role: 'labassistant' },
    { model: Student, role: 'student' },
    { model: Facilitator, role: 'facilitator' },
    { model: Admin, role: 'admin' },
  ];
  for (const { model, role } of models) {
    const user = await model.findOne({ where: { email } });
    if (user) return { user, role };
  }
  return null;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const found = await findUserByEmail(email);
    if (!found) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { user, role } = found;
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, firstName: user.firstName },
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
    if (role === 'student') {
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
      case 'departmentHead':
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
