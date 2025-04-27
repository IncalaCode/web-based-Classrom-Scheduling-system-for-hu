const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Associate with Course model
      Schedule.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
        onDelete: 'CASCADE'
      });
      
      // Associate with Classroom model
      Schedule.belongsTo(models.Classroom, {
        foreignKey: 'classroomId',
        as: 'classroom',
        onDelete: 'SET NULL'
      });
    }
  }
  
  Schedule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'course_id',
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    departmentId : {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classroomId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'classroom_id',
      references: {
        model: 'Classrooms',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false,
      field: 'day_of_week'
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'end_time'
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'room_number'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'Schedules',
    timestamps: true,
    hooks: {
      beforeCreate: async (schedule, options) => {
        await checkScheduleConflicts(schedule, options, sequelize);
      },
      beforeUpdate: async (schedule, options) => {
        if (schedule.changed('classroomId') || 
            schedule.changed('dayOfWeek') || 
            schedule.changed('startTime') || 
            schedule.changed('endTime')) {
          await checkScheduleConflicts(schedule, options, sequelize);
        }
      }
    }
  });
  
  // Function to check for schedule conflicts
  async function checkScheduleConflicts(schedule, options, sequelize) {
    // Only check conflicts if a classroom is assigned
    if (!schedule.classroomId) return;
    
    const { Op } = require('sequelize');
    const Schedule = sequelize.models.Schedule;
    
    // Find any overlapping schedules for the same classroom and day
    const conflictingSchedules = await Schedule.findAll({
      where: {
        id: { [Op.ne]: schedule.id }, // Exclude current schedule
        classroomId: schedule.classroomId,
        dayOfWeek: schedule.dayOfWeek,
        isActive: true,
        [Op.or]: [
          // Case 1: New schedule starts during an existing schedule
          {
            startTime: { [Op.lte]: schedule.startTime },
            endTime: { [Op.gt]: schedule.startTime }
          },
          // Case 2: New schedule ends during an existing schedule
          {
            startTime: { [Op.lt]: schedule.endTime },
            endTime: { [Op.gte]: schedule.endTime }
          },
          // Case 3: New schedule completely contains an existing schedule
          {
            startTime: { [Op.gte]: schedule.startTime },
            endTime: { [Op.lte]: schedule.endTime }
          }
        ]
      },
      transaction: options.transaction
    });
    
    if (conflictingSchedules.length > 0) {
      throw new Error('Schedule conflicts with existing bookings for this classroom');
    }
  }
  
  return Schedule;
};
