export default (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  }, {});
  TaskStatus.associate = (models) => {
    TaskStatus.hasMany(models.Task, { as: 'Tasks', foreignKey: 'statusId' });
  };
  return TaskStatus;
};
