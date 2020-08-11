'use strict';
var bcrypt = require('bcrypt-nodejs')
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
      User.belongsTo(models.Room,{foreignKey:'roomId',as:'roomDetails'})
      //User.belongsTo(models.FollowRequest,{foreignKey:'userId',as:'userDetails'})
      User.hasMany(models.FollowRequest,{foreignKey:'userId',as:'userDetails'})
    }
  };
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    socketId:DataTypes.STRING,
    roomId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  }
  return User;
};