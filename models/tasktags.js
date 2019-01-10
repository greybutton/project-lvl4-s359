export default (sequelize, DataTypes) => {
  const TaskTags = sequelize.define('TaskTags', {
    taskId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
  }, {});
  // TaskTags.associate = function(models) {
  //   // associations can be defined here
  // };
  return TaskTags;
};
