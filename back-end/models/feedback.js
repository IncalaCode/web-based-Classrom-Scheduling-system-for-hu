const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with Department
      Feedback.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department',
        onDelete: 'CASCADE'
      });
      
      // Define association with Schedule (optional)
      Feedback.belongsTo(models.Schedule, {
        foreignKey: 'scheduleId',
        as: 'schedule',
        onDelete: 'SET NULL'
      });
      
      // Define association with Course (optional)
      Feedback.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
        onDelete: 'SET NULL'
      });
      
      // Define association with sender (can be any user type)
      // This is a polymorphic association using senderType and senderId
      // The actual association will be determined at runtime based on senderType
    }
  }
  
  Feedback.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Feedback title is required'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Feedback content is required'
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
    scheduleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Schedules',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of the user who sent the feedback'
    },
    senderType: {
      type: DataTypes.ENUM('student', 'instructor', 'departmentHead', 'labAssistant', 'facilitator', 'admin'),
      allowNull: false,
      comment: 'Type of user who sent the feedback'
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'resolved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
      allowNull: false
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    responseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    responderId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the user who responded to the feedback'
    },
    responderType: {
      type: DataTypes.ENUM('departmentHead', 'facilitator', 'admin'),
      allowNull: true,
      comment: 'Type of user who responded to the feedback'
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
    modelName: 'Feedback',
    tableName: 'Feedbacks',
    hooks: {
      beforeCreate: async (feedback) => {
        // You could add validation logic here
        // For example, ensure the sender exists in the appropriate table
      },
      afterCreate: async (feedback, options) => {
        // You could add notification logic here
        // For example, notify the department head about new feedback
      }
    }
  });
  
  return Feedback;
};