'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class LabAssistant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LabAssistant.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department'
      });
    }

    // Method to check if password matches
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  
  LabAssistant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notEmpty: {
          msg: 'Email is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters long'
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
    role: {
      type: DataTypes.STRING,
      defaultValue: 'labAssistant',
      allowNull: false
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
    modelName: 'LabAssistant',
    hooks: {
      beforeCreate: async (labAssistant) => {
        if (labAssistant.password) {
          const salt = await bcrypt.genSalt(10);
          labAssistant.password = await bcrypt.hash(labAssistant.password, salt);
        }
      },
      beforeUpdate: async (labAssistant) => {
        if (labAssistant.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          labAssistant.password = await bcrypt.hash(labAssistant.password, salt);
        }
      }
    }
  });
  
  return LabAssistant;
};