'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

// Get the environment configuration
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function seed() {
  console.log(`Running seed in ${env} environment`);
  
  // Create Sequelize instance
  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: false
    }
  );

  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get QueryInterface
    const queryInterface = sequelize.getQueryInterface();

    // 1. Create Admin
    console.log('Creating Admin user...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const adminId = uuidv4();
    await queryInterface.bulkInsert('Admins', [{
      id: adminId,
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    console.log('Admin created successfully with ID:', adminId);
    
    // 2. Create Facilitator
    console.log('Creating Facilitator user...');
    const facilitatorPassword = await bcrypt.hash('facilitator123', salt);
    
    const facilitatorId = uuidv4();
    await queryInterface.bulkInsert('Facilitators', [{
      id: facilitatorId,
      firstName: 'Main',
      lastName: 'Facilitator',
      email: 'facilitator@example.com',
      password: facilitatorPassword,
      role: 'facilitator',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    console.log('Facilitator created successfully with ID:', facilitatorId);
    
    // 3. Create Departments
    console.log('Creating Departments...');
    const departmentData = [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Electrical Engineering', code: 'EE' },
      { name: 'Mechanical Engineering', code: 'ME' },
      { name: 'Civil Engineering', code: 'CE' }
    ];
    
    const departments = departmentData.map(dept => {
      const id = uuidv4();
      return {
        id,
        name: dept.name,
        code: dept.code,
        facilitatorId: facilitatorId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    await queryInterface.bulkInsert('Departments', departments, {});
    console.log('Departments created successfully');
    
    // 4. Create Department Heads
    console.log('Creating Department Heads...');
    const departmentHeadPassword = await bcrypt.hash('depthead123', salt);
    
    const departmentHeads = [];
    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      const deptName = department.name.replace(/\s+/g, '').toLowerCase();
      
      departmentHeads.push({
        id: uuidv4(),
        firstName: department.name.split(' ')[0],
        lastName: 'Head',
        email: `head.${deptName}@example.com`,
        password: departmentHeadPassword,
        departmentId: department.id,
        role: 'departmentHead',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await queryInterface.bulkInsert('DepartmentHeads', departmentHeads, {});
    console.log('Department Heads created successfully');
    
    // 5. Create an Instructor for each department
    console.log('Creating Instructors...');
    const instructorPassword = await bcrypt.hash('instructor123', salt);
    
    const instructors = [];
    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      const deptName = department.name.replace(/\s+/g, '').toLowerCase();
      
      instructors.push({
        id: uuidv4(),
        firstName: 'Instructor',
        lastName: department.name.split(' ')[0],
        email: `instructor.${deptName}@example.com`,
        password: instructorPassword,
        departmentId: department.id,
        role: 'instructor',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await queryInterface.bulkInsert('Instructors', instructors, {});
    console.log('Instructors created successfully');
    
    // 6. Create a Lab Assistant for each department
    console.log('Creating Lab Assistants...');
    const labAssistantPassword = await bcrypt.hash('labassistant123', salt);
    
    const labAssistants = [];
    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      const deptName = department.name.replace(/\s+/g, '').toLowerCase();
      
      labAssistants.push({
        id: uuidv4(),
        firstName: 'Lab',
        lastName: 'Assistant',
        email: `lab.${deptName}@example.com`,
        password: labAssistantPassword,
        departmentId: department.id,
        role: 'labAssistant',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await queryInterface.bulkInsert('LabAssistants', labAssistants, {});
    console.log('Lab Assistants created successfully');
    
    // 7. Create a Student for each department
    console.log('Creating Students...');
    const studentPassword = await bcrypt.hash('student123', salt);
    
    const students = [];
    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      const deptName = department.name.replace(/\s+/g, '').toLowerCase();
      
      students.push({
        id: uuidv4(),
        firstName: 'Student',
        lastName: department.name.split(' ')[0],
        email: `student.${deptName}@example.com`,
        password: studentPassword,
        year: 2,
        semester: 1,
        departmentId: department.id,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await queryInterface.bulkInsert('Students', students, {});
    console.log('Students created successfully');
    
    console.log('All seed data created successfully!');
    
    // Close the connection
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seed().then(() => {
  console.log('Seeding completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});