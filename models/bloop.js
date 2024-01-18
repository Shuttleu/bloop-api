'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Bloop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Bloop.init({
  }, {
    sequelize,
    modelName: 'Bloop',
  });

  Bloop.associate = models => {
    Bloop.belongsTo(models.User );
    Bloop.belongsTo(models.Box );
  };

  return Bloop;
};