'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LabRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LabRoom.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department'
      });
      
      LabRoom.hasMany(models.Schedule, {
        foreignKey: 'labRoomId',
        as: 'schedules'
      });
    }
  }
  
  LabRoom.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    labRoomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Lab room number is required'
        }
      }
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Departments',
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
    modelName: 'LabRoom',
  });
  
  return LabRoom;
};