export default (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.TEXT,
  }, {});
  Task.associate = (models) => {
    Task.belongsTo(models.User, { as: 'Creator', foreignKey: 'creatorId' });
  };
  return Task;
};
