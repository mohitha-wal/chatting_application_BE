'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Room.hasMany(models.User,{foreignKey:'roomId',as:'roomDetails'})
      Room.hasMany(models.FollowRequest,{foreignKey:'roomId',as:'roomDetails'})
    }
  };
  Room.init({
    roomName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};