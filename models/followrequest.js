'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FollowRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FollowRequest.belongsTo(models.User,{foreignKey:'userId',as:'userDetails'})
      FollowRequest.belongsTo(models.User,{foreignKey:'followingId',as:'followingUserDetails'})
     // FollowRequest.belongsTo(models.Room,{foreignKey:'roomId',as:'roomDetails'})
    }
  };
  FollowRequest.init({
    userId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER,
    accept: DataTypes.BOOLEAN,
    roomId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FollowRequest',
  });
  return FollowRequest;
};