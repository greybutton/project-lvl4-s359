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
  // TaskStatus.associate = (models) =>{
  //   // associations can be defined here
  // };
  return TaskStatus;
};
