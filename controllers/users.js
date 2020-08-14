const models = require('../models');
const customResponse = require('../response/customResponse')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const addUser = async ({ id, name, password }, req, res) => {
  userObj = {
    socketId: id
  }
  console.log(userObj)
  let updatedUser = await models.User.update(userObj, {
    where: {
      name: name
    }
  })
  let existingUser = await models.User.findOne({
    where: {
      name: name
    }
  });
  console.log(updatedUser)
  return existingUser;

}
const removeUser = async (id) => {
  const deletingUser = await models.User.findOne({
    where: {
      socketId: id
    },
    required: true,
    include: [{
      model: models.Room,
      as: 'roomDetails'
    }]
  });
  const deletedUser = await models.User.destroy({
    where: {
      socketId: id
    }
  })
  return deletingUser
}

const getUser = async (id) => {
  const existingUser = await models.User.findOne({
    where: {
      socketId: id
    }
  });
  console.log(existingUser)
  var roomData = await models.Room.findOne({
    include: [{
      model: models.FollowRequest,
      where: {
        userId: existingUser.id
      },
      as: 'roomDetails',

    }]
  })
  console.log(JSON.stringify(roomData))
  return existingUser
}

const getUsersInRoom = async (req, res) => {
  const usersInRoom = await models.User.findAll({
    // where:{
    //   name:{
    //     [Op.ne]:req.params.userName}
    // },
    include: [{
      model: models.FollowRequest,
      as: 'userDetails',
      include: [{
        model: models.User,
        as: 'followingUserDetails'
      }]
    },
    ]
  }
  )
  customResponse(200, usersInRoom, res)
  return usersInRoom
}
const getFollowers = async (req, res) => {
  const followRequests = await models.User.findOne({
    where: {
      name: req.params.userName
    }

  })
  var follow = await models.FollowRequest.findAll({
    where: {
      followingId: followRequests.id,
      accept: true
    },
    include: [{
      model: models.User,
      as: 'userDetails',
      required: true
    }]

  })
  console.log(follow.length)
  if (follow.length < 1) {
    console.log("hi")
    follow = await models.FollowRequest.findAll({
      where: {
        userId: followRequests.id,
        accept: true
      },
      include: [{
        model: models.User,
        as: 'followingUserDetails',
        required: true
      }]

    })
  }
  customResponse(200, follow, res)
}
const getRoomData = async (req, res) => {
  console.log(req.params.userName, req.params.followingName)
  const user = await models.User.findOne({
    where: {
      name: req.params.followingName
    }
  })
  const userRequesting = await models.User.findOne({
    where: {
      name: req.params.userName
    }
  })
  var roomData = await models.Room.findOne({
    include: [{
      model: models.FollowRequest,
      where: {
        userId: userRequesting.id,
        followingId: user.id
      },
      as: 'roomDetails',

    }]
  })
  console.log(roomData)
  if (roomData === null) {
    roomData = await models.Room.findOne({
      include: [{
        model: models.FollowRequest,
        where: {
          userId: user.id,
          followingId: userRequesting.id
        },
        as: 'roomDetails',

      }]
    })
    console.log(roomData)
  }
  customResponse(200, roomData, res)
}
module.exports = { addUser, removeUser, getUser, getUsersInRoom, getFollowers, getRoomData };