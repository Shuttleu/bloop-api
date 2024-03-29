'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Box extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  Box.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Box',
  });

  Box.associate = models => {
    Box.hasMany(models.Bloop);
  };

  return Box;
};