'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Schedules', 'classroomId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Classrooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    // Create an index for faster lookups
    await queryInterface.addIndex('Schedules', ['classroomId', 'day_of_week', 'start_time', 'end_time'], {
      name: 'schedules_classroom_time_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the index first
    await queryInterface.removeIndex('Schedules', 'schedules_classroom_time_idx');
    
    // Then remove the column
    await queryInterface.removeColumn('Schedules', 'classroomId');
  }
};