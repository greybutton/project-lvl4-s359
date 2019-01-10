export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING,
  }, {});
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Task, { as: 'Tasks', through: 'TaskTags', foreignKey: 'tagId' });
  };
  return Tag;
};
