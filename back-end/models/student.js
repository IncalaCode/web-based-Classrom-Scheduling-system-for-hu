'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department'
      });
      
      // A student can be enrolled in many courses - only if Course model exists
      if (models.Course) {
        Student.belongsToMany(models.Course, {
          through: 'StudentCourses',
          foreignKey: 'studentId',
          otherKey: 'courseId',
          as: 'courses'
        });
      }
      
      // A student can have many attendances - only if Attendance model exists
      if (models.Attendance) {
        Student.hasMany(models.Attendance, {
          foreignKey: 'studentId',
          as: 'attendances'
        });
      }
      
      // A student can have many assessment results - only if AssessmentResult model exists
      if (models.AssessmentResult) {
        Student.hasMany(models.AssessmentResult, {
          foreignKey: 'studentId',
          as: 'assessmentResults'
        });
      }
    }

    // Method to check if password matches
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  
  Student.init({
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
        },
        max: {
          args: [6],
          msg: 'Year cannot be more than 6'
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
      defaultValue: 'student',
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
    modelName: 'Student',
    hooks: {
      beforeCreate: async (student) => {
        if (student.password) {
          const salt = await bcrypt.genSalt(10);
          student.password = await bcrypt.hash(student.password, salt);
        }
      },
      beforeUpdate: async (student) => {
        if (student.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          student.password = await bcrypt.hash(student.password, salt);
        }
      }
    }
  });
  
  return Student;
};
