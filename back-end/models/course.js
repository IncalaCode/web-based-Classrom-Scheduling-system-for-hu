'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department'
      });
      
      // Only define associations for models that exist
      if (models.Schedule) {
        Course.hasMany(models.Schedule, {
          foreignKey: 'courseId',
          as: 'schedules'
        });
      }
      
      if (models.Student) {
        Course.belongsToMany(models.Student, {
          through: 'StudentCourses',
          foreignKey: 'courseId',
          otherKey: 'studentId',
          as: 'students'
        });
      }
      
      if (models.CourseMaterial) {
        Course.hasMany(models.CourseMaterial, {
          foreignKey: 'courseId',
          as: 'materials'
        });
      }
      
      if (models.Assessment) {
        Course.hasMany(models.Assessment, {
          foreignKey: 'courseId',
          as: 'assessments'
        });
      }
      
      if (models.Attendance) {
        Course.hasMany(models.Attendance, {
          foreignKey: 'courseId',
          as: 'attendances'
        });
      }
    }
  }
  
  Course.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Course code is required'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Course title is required'
        }
      }
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Semester is required'
        }
      }
    },
    ects: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'ECTS must be an integer'
        },
        min: {
          args: [1],
          msg: 'ECTS must be at least 1'
        }
      }
    },
    crHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Credit hours must be an integer'
        },
        min: {
          args: [1],
          msg: 'Credit hours must be at least 1'
        }
      }
    },
    lecHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Lecture hours must be an integer'
        },
        min: {
          args: [0],
          msg: 'Lecture hours cannot be negative'
        }
      }
    },
    labHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Lab hours must be an integer'
        },
        min: {
          args: [0],
          msg: 'Lab hours cannot be negative'
        }
      }
    },
    program: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Program is required'
        }
      }
    },
    academicDegree: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Academic degree is required'
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
    modelName: 'Course',
  });
  
  return Course;
};
