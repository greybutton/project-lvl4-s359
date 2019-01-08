module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Tasks',
    'statusId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'TaskStatuses',
        key: 'id',
      },
    },
  ),

  down: queryInterface => queryInterface.removeColumn('Tasks', 'statusId'),
};
