'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course'
      });
      
      Schedule.belongsTo(models.Classroom, {
        foreignKey: 'classroomId',
        as: 'classroom'
      });
      
      Schedule.belongsTo(models.LabRoom, {
        foreignKey: 'labRoomId',
        as: 'labRoom'
      });
      
      Schedule.belongsTo(models.InstructorList, {
        foreignKey: 'instructorListId',
        as: 'instructor'
      });
      
      Schedule.belongsTo(models.LabAssistantList, {
        foreignKey: 'labAssistantListId',
        as: 'labAssistant'
      });
    }
  }
  
  Schedule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classroomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Classrooms',
        key: 'id'
      }
    },
    classroomNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    labRoomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'LabRooms',
        key: 'id'
      }
    },
    labRoomNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructorListId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'instructor_lists',
        key: 'id'
      }
    },
    instructorFirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructorLastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    labAssistantListId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'lab_assistant_lists',
        key: 'id'
      }
    },
    labAssistantFirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    labAssistantLastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Year must be an integer'
        },
        min: {
          args: [1],
          msg: 'Year must be at least 1'
        }
      }
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Semester must be an integer'
        },
        min: {
          args: [1],
          msg: 'Semester must be at least 1'
        },
        max: {
          args: [2],
          msg: 'Semester cannot be more than 2'
        }
      }
    },
    program: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lecPeriod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    labPeriod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeSlot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    conflictStatus: {
      type: DataTypes.ENUM('None', 'Pending', 'Resolved'),
      allowNull: false,
      defaultValue: 'None'
    },
    conflictType: {
      type: DataTypes.ENUM('Room Conflict', 'InstructorL Conflict', 'LabAssistantL conflict', 'Time Conflict', 'Other'),
      allowNull: true
    },
    draft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  
  return Schedule;
};