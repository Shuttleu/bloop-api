'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Achievement.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    points: DataTypes.INTEGER,
    uuid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Achievement',
  });

  Achievement.associate = models => {
    Achievement.belongsToMany(models.User, { through: 'UserAchievements'} );
  };

  return Achievement;
};