'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Classroom.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department'
      });
      
      // Associate with Schedule model
      Classroom.hasMany(models.Schedule, {
        foreignKey: 'classroomId',
        as: 'schedules'
      });
      
      // Associate with Facilitator model
      Classroom.belongsTo(models.Facilitator, {
        foreignKey: 'facilitatorId',
        as: 'facilitator',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  
  Classroom.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    building: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Building name is required'
        }
      }
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Floor number must be a non-negative integer'
        }
      }
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Room name is required'
        }
      }
    },
    roomDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        notEmpty: {
          msg: 'Room description cannot be empty'
        }
      }
    },
    classRoomInterval:{ // it tells where the room start and end
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Room interval cannot be empty'
        }
      }
    },
    type: {
      type: DataTypes.ENUM('classroom', 'lab'),
      allowNull: false,
      defaultValue: 'classroom',
      validate: {
        notEmpty: {
          msg: 'Room type is required'
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: {
          args: [1],
          msg: 'Capacity must be at least 1'
        }
      }
    },
    equipment: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'JSON object containing equipment available in the room'
    },
    isAvailableForAllocation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Departments',
        key: 'id'
      }
    },
    facilitatorId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the facilitator who manages this classroom',
      references: {
        model: 'Facilitators',
        key: 'id'
      }
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
    modelName: 'Classroom',
  });
  
  return Classroom;
};
