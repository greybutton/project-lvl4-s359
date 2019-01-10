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
    Task.belongsTo(models.User, { as: 'Assigned', foreignKey: 'assignedId' });
    Task.belongsTo(models.TaskStatus, { as: 'Status', foreignKey: 'statusId' });
    Task.belongsToMany(models.Tag, { as: 'Tags', through: 'TaskTags', foreignKey: 'taskId' });
  };
  return Task;
};
