'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init({
    username: DataTypes.STRING,
    uid: DataTypes.STRING,
    cardId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = models => {
    User.belongsToMany(models.Achievement, { through: 'UserAchievements'} );
    User.hasMany(models.Bloop);
  };

  return User;
};