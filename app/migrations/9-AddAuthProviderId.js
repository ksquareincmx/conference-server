'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
  */
    return queryInterface.addColumn('user', 'authProviderId', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
      references: { model: 'authProvider', key: 'id' }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('user');
    */
    return queryInterface.removeColumn('user', 'authProviderId');
  }
};