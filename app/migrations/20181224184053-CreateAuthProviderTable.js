'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('authProvider', {
      providerId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      providerName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('authProvider');
  }
};
