'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Department.hasOne(models.DepartmentHead, {
        foreignKey: 'departmentId',
        as: 'departmentHead'
      });
      
      // A department can have many instructors
      Department.hasMany(models.Instructor, {
        foreignKey: 'departmentId',
        as: 'instructors'
      });
      
      // A department can have many courses
      Department.hasMany(models.Course, {
        foreignKey: 'departmentId',
        as: 'courses'
      });

      // A department belongs to a facilitator
      Department.belongsTo(models.Facilitator, {
        foreignKey: 'facilitatorId',
        as: 'facilitator'
      });
    }
  }
  
  Department.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Department name is required'
        }
      }
    },
    facilitatorId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    modelName: 'Department',
  });
  
  return Department;
};