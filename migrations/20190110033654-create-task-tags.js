module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('TaskTags', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    taskId: {
      type: Sequelize.INTEGER,
    },
    tagId: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('TaskTags'),
};
