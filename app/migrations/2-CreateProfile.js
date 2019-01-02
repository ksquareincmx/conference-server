'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('profile', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      time_zone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      locale: {
        type: Sequelize.ENUM("en", "es"),
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: 
        { 
          model: 'user', 
          key: 'id' 
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
    return queryInterface.dropTable('profile');  
  }
};
