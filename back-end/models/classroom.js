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
      
      Classroom.hasMany(models.Schedule, {
        foreignKey: 'classroomId',
        as: 'schedules'
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
    classroomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Classroom number is required'
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
    modelName: 'Classroom',
  });
  
  return Classroom;
};