'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Facilitator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Facilitator.hasMany(models.Department, {
        foreignKey: 'facilitatorId',
        as: 'departments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Add the missing association to Classroom
      Facilitator.hasMany(models.Classroom, {
        foreignKey: 'facilitatorId',
        as: 'classrooms',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }

    // Method to check if password matches
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  
  Facilitator.init({
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
    FacilitatorName: {
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
    role: {
      type: DataTypes.STRING,
      defaultValue: 'facilitator',
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
    modelName: 'Facilitator',
    hooks: {
      beforeCreate: async (facilitator) => {
        if (facilitator.password) {
          const salt = await bcrypt.genSalt(10);
          facilitator.password = await bcrypt.hash(facilitator.password, salt);
        }
      },
      beforeUpdate: async (facilitator) => {
        if (facilitator.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          facilitator.password = await bcrypt.hash(facilitator.password, salt);
        }
      }
    }
  });
  
  return Facilitator;
};
