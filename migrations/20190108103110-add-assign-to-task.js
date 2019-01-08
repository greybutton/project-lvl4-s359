module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Tasks',
    'assignedId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  ),

  down: queryInterface => queryInterface.removeColumn('Tasks', 'assignedId'),
};
