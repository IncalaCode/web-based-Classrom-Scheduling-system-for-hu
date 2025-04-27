
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
    
    // Generate timestamp to make emails unique for each run
    const timestamp = Date.now();
    
    // 1. Create Admin if not exists
    console.log('Creating Admin user...');
    const adminEmail = `admin_${timestamp}@example.com`;
    
    // Check if admin already exists with this email
    const existingAdmins = await sequelize.query(
      `SELECT * FROM Admins WHERE email = '${adminEmail}'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    let adminId;
    if (existingAdmins.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      
      adminId = uuidv4();
      await queryInterface.bulkInsert('Admins', [{
        id: adminId,
        firstName: 'System',
        lastName: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
      console.log('Admin created successfully with ID:', adminId);
    } else {
      adminId = existingAdmins[0].id;
      console.log('Admin already exists with ID:', adminId);
    }
    
    // 2. Create Facilitator if not exists
    console.log('Creating Facilitator user...');
    const facilitatorEmail = `facilitator_${timestamp}@example.com`;
    
    // Check if facilitator already exists with this email
    const existingFacilitators = await sequelize.query(
      `SELECT * FROM Facilitators WHERE email = '${facilitatorEmail}'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    let facilitatorId;
    if (existingFacilitators.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const facilitatorPassword = await bcrypt.hash('facilitator123', salt);
      
      facilitatorId = uuidv4();
      await queryInterface.bulkInsert('Facilitators', [{
        id: facilitatorId,
        firstName: 'Main',
        lastName: 'Facilitator',
        email: facilitatorEmail,
        password: facilitatorPassword,
        role: 'facilitator',
        FacilitatorName: 'Main Facilitator',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
      console.log('Facilitator created successfully with ID:', facilitatorId);
    } else {
      facilitatorId = existingFacilitators[0].id;
      console.log('Facilitator already exists with ID:', facilitatorId);
    }
    
    // 3. Create Department if not exists
    console.log('Creating Department...');
    const departmentName = `Computer Science ${timestamp}`;
    
    // Check if department already exists with this name
    const existingDepartments = await sequelize.query(
      `SELECT * FROM Departments WHERE name = '${departmentName}'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    let departmentId;
    if (existingDepartments.length === 0) {
      departmentId = uuidv4();
      await queryInterface.bulkInsert('Departments', [{
        id: departmentId,
        name: departmentName,
        facilitatorId: facilitatorId,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
      console.log('Department created successfully with ID:', departmentId);
    } else {
      departmentId = existingDepartments[0].id;
      console.log('Department already exists with ID:', departmentId);
    }
    
    // 4. Create Department Head if not exists
    console.log('Creating Department Head...');
    const departmentHeadEmail = `depthead_${timestamp}@example.com`;
    
    // Check if department head already exists with this email
    const existingDepartmentHeads = await sequelize.query(
      `SELECT * FROM DepartmentHeads WHERE email = '${departmentHeadEmail}'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    let departmentHeadId;
    if (existingDepartmentHeads.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const departmentHeadPassword = await bcrypt.hash('depthead123', salt);
      
      departmentHeadId = uuidv4();
      await queryInterface.bulkInsert('DepartmentHeads', [{
        id: departmentHeadId,
        firstName: 'Department',
        lastName: 'Head',
        email: departmentHeadEmail,
        password: departmentHeadPassword,
        departmentId: departmentId,
        role: 'departmentHead',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
      console.log('Department Head created successfully with ID:', departmentHeadId);
    } else {
      departmentHeadId = existingDepartmentHeads[0].id;
      console.log('Department Head already exists with ID:', departmentHeadId);
    }
    
    // 5. Create a Classroom
    console.log('Creating Classroom...');
    const classroomName = `Room-${timestamp.toString().slice(-4)}`;
    
    // Check if classroom already exists with this name
    const existingClassrooms = await sequelize.query(
      `SELECT * FROM Classrooms WHERE roomName = '${classroomName}' AND departmentId = '${departmentId}'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingClassrooms.length === 0) {
      const classroomId = uuidv4();
      await queryInterface.bulkInsert('Classrooms', [{
        id: classroomId,
        building: 'Main Building',
        floor: 2,
        roomName: classroomName,
        roomDescription: 'Standard classroom with projector',
        classRoomInterval: JSON.stringify([101, 102]),
        type: 'classroom',
        capacity: 30,
        equipment: JSON.stringify({
          projector: true,
          computers: 0,
          whiteboard: true
        }),
        isAvailableForAllocation: true,
        departmentId: departmentId,
        facilitatorId: facilitatorId,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
      console.log('Classroom created successfully with ID:', classroomId);
    } else {
      console.log('Classroom already exists with ID:', existingClassrooms[0].id);
    }
    
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
