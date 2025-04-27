const { Student, DepartmentHead, LabAssistant, Facilitator, Admin } = require('../models');

exports.getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findByPk(adminId, {
      attributes: ['firstName', 'lastName', 'email']
    });

    const [
      studentsCount,
      departmentHeadsCount,
      labAssistantsCount,
      facilitatorsCount
    ] = await Promise.all([
      Student.count(),
      DepartmentHead.count(),
      LabAssistant.count(),
      Facilitator.count()
    ]);

    const dashboardData = {
      admin: {
        fullName: `${admin.firstName} ${admin.lastName}`,
        email: admin.email
      },
      stats: {
        students: studentsCount,
        teachers: departmentHeadsCount,
        parents: labAssistantsCount, 
        courses: facilitatorsCount  
      }
    };

    return res.status(200).json({
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    return res.status(500).json({
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};