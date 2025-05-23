'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the existing foreign key constraint
    await queryInterface.removeConstraint('classrooms', 'classrooms_ibfk_2');

    // Add the new foreign key constraint with ON DELETE CASCADE
    await queryInterface.addConstraint('classrooms', {
      fields: ['facilitatorId'],
      type: 'foreign key',
      name: 'classrooms_ibfk_2',
      references: {
        table: 'facilitators',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the CASCADE constraint
    await queryInterface.removeConstraint('classrooms', 'classrooms_ibfk_2');

    // Re-add the original constraint (NO ACTION)
    await queryInterface.addConstraint('classrooms', {
      fields: ['facilitatorId'],
      type: 'foreign key',
      name: 'classrooms_ibfk_2',
      references: {
        table: 'facilitators',
        field: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    });
  }
};
