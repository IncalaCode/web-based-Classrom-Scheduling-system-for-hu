const { Classroom, Department, Facilitator , DepartmentHead } = require('../models');
const { Op } = require('sequelize');

exports.getAllClassrooms = async (req, res) => {
  try {
    // Get facilitator ID from authenticated user
    const facilitatorId = req.user.id;
    
    if (!facilitatorId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const classrooms = await Classroom.findAll({
      where: {
        facilitatorId: facilitatorId
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: Facilitator,
          as: 'facilitator',
          attributes: ['id', 'firstName', 'email']
        }
      ]
    });
    
    return res.status(200).json({count : classrooms.length || 0 , data : classrooms });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving classrooms', error: error.message });
  }
};


exports.getAllClassroomsByDepartment = async (req, res) => {
  try {
    const departmentHeadId = req.user.id;
    
    if (!departmentHeadId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const department  = await DepartmentHead.findOne({
      where: {
        id: departmentHeadId
      },
      attributes: ['departmentId']
    });
  
    const classrooms = await Classroom.findAll({
      where: {
        departmentId: department.departmentId
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: Facilitator,
          as: 'facilitator',
          attributes: ['id', 'firstName', 'email']
        }
      ]
    });
    
    return res.status(200).json({count : classrooms.length || 0 , data : classrooms });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving classrooms', error: error.message });
  }
};

exports.getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const classroom = await Classroom.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: Facilitator,
          as: 'facilitator',
          attributes: ['id', 'firstName', 'email']
        }
      ]
    });
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    return res.status(200).json({data : classroom});
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving classroom', error: error.message });
  }
};

exports.createClassroom = async (req, res) => {
  try {
    const { 
      building, 
      floor, 
      roomName, 
      roomDescription, 
      classRoomInterval, 
      type, 
      capacity, 
      equipment, 
      isAvailableForAllocation, 
      departmentId 
    } = req.body;
    
    // Get facilitatorId from authenticated user
    const facilitatorId = req.user.id;
    
    if (!facilitatorId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Check if classroom with same building, floor and roomName already exists
    const existingClassroom = await Classroom.findOne({
      where: { 
        building,
        floor,
        roomName,
        departmentId 
      }
    });
    
    if (existingClassroom) {
      return res.status(400).json({ message: 'Classroom already exists in this building, floor and department' });
    }
    
    // Validate classRoomInterval format (should be an array like [100, 101])
    let classroomInterval;
    try {
      if (typeof classRoomInterval === 'string') {
        classroomInterval = JSON.parse(classRoomInterval);
      } else {
        classroomInterval = classRoomInterval;
      }
      
      if (!Array.isArray(classroomInterval) || classroomInterval.length !== 2) {
        return res.status(400).json({ message: 'classRoomInterval must be an array with start and end values' });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid classRoomInterval format. Expected array [start, end]' });
    }
    
    const classroom = await Classroom.create({
      building,
      floor,
      roomName,
      roomDescription,
      classRoomInterval: JSON.stringify(classroomInterval),
      type,
      capacity,
      equipment,
      isAvailableForAllocation,
      departmentId,
      facilitatorId
    });
    
    return res.status(201).json(classroom);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating classroom', error: error.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      building, 
      floor, 
      roomName, 
      roomDescription, 
      classRoomInterval, 
      type, 
      capacity, 
      equipment, 
      isAvailableForAllocation, 
      departmentId 
    } = req.body;
    
    const classroom = await Classroom.findByPk(id);
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    // Get facilitatorId from authenticated user
    const facilitatorId = req.user.id;
    
    if (!facilitatorId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (departmentId) {
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
    }
    
    // Check if updating to an existing classroom (same building, floor, roomName)
    if (building && floor && roomName && departmentId && 
        (building !== classroom.building || floor !== classroom.floor || roomName !== classroom.roomName)) {
      const existingClassroom = await Classroom.findOne({
        where: { 
          building,
          floor,
          roomName,
          departmentId,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingClassroom) {
        return res.status(400).json({ message: 'Classroom already exists in this building, floor and department' });
      }
    }
    
    // Validate classRoomInterval format if provided
    let classroomInterval;
    if (classRoomInterval) {
      try {
        if (typeof classRoomInterval === 'string') {
          classroomInterval = JSON.parse(classRoomInterval);
        } else {
          classroomInterval = classRoomInterval;
        }
        
        if (!Array.isArray(classroomInterval) || classroomInterval.length !== 2) {
          return res.status(400).json({ message: 'classRoomInterval must be an array with start and end values' });
        }
        
        // Convert to string for storage
        classroomInterval = JSON.stringify(classroomInterval);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid classRoomInterval format. Expected array [start, end]' });
      }
    }
    
    await classroom.update({
      building: building || classroom.building,
      floor: floor !== undefined ? floor : classroom.floor,
      roomName: roomName || classroom.roomName,
      roomDescription: roomDescription !== undefined ? roomDescription : classroom.roomDescription,
      classRoomInterval: classroomInterval || classroom.classRoomInterval,
      type: type || classroom.type,
      capacity: capacity !== undefined ? capacity : classroom.capacity,
      equipment: equipment || classroom.equipment,
      isAvailableForAllocation: isAvailableForAllocation !== undefined ? isAvailableForAllocation : classroom.isAvailableForAllocation,
      departmentId: departmentId || classroom.departmentId,
      facilitatorId: facilitatorId
    });
    
    const updatedClassroom = await Classroom.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: Facilitator,
          as: 'facilitator',
          attributes: ['id', 'firstName', 'email']
        }
      ]
    });
    
    return res.status(200).json(updatedClassroom);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating classroom', error: error.message });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const classroom = await Classroom.findByPk(id);
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    // Check if the user is the facilitator of this classroom
    const facilitatorId = req.user.id;
    if (classroom.facilitatorId !== facilitatorId) {
      return res.status(403).json({ message: 'You are not authorized to delete this classroom' });
    }
    
    await classroom.destroy();
    
    return res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting classroom', error: error.message });
  }
};
