const models = require('../models');
const customResponse = require('../response/customResponse')
const jwt=require('jsonwebtoken')
const addUser = async ({ id, name, password }, req, res) => {
//   var token
//   //var password="16121a1528"
//   name = name.trim().toLowerCase();
//  // room = room.trim().toLowerCase();
//   let userObj
  // let existingUser = await models.User.findOne({
  //   where: {
  //     name: name
  //   }
  // });
//   if (!name ) return { error: 'Username and room are required.' };
//   if (existingUser)
//   {
//     existingUser.comparePassword(password, (err, isMatch) => {
//       if (isMatch && !err) {
//            token = jwt.sign({ name: name }, 'nodeauthsecret');
//           //res.status(200).json({ success: true, token: token, user: existingUser, msg: 'login successful' });
//        } 
//       //else {
//       //     res.status(201).send({ msg: 'Authentication failed. Wrong password.' });
//       // }
//   })
    userObj = {
      socketId: id
    }
    console.log(userObj)
    let updatedUser=await models.User.update(userObj,{
      where:{
        name:name
      }
    })
    let existingUser = await models.User.findOne({
      where: {
        name: name
      }
    });
    //console.log(updatedUser)
   // existingUser = existingUser.toJSON()
    // existingUser.roomName = room
    //existingUser.token = token
    console.log(updatedUser)
    return existingUser;
  
  // else {
  //   // let roomObj = {
  //   //   roomName: room
  //   // }
  //   // const existingRoom = await models.Room.findOne({
  //   //   where: {
  //   //     roomName: room
  //   //   }
  //   // });
  //   // if (!existingRoom) {
  //   //   const room1 = await models.Room.create(roomObj)

  //   //   userObj = {
  //   //     name: name,
  //   //     roomId: room1.id,
  //   //     socketId: id
  //   //   }
  //   // }
  //   // else {
  //     userObj = {
  //       name: name,
  //       password : password,
  //       socketId: id
  //     }
  //   }
  //   let user = await models.User.create(userObj)
  //   user = user.toJSON()
    //user.roomName = room
    //return user;
}
const removeUser = async(id) => {
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
  //console.log(deletingUser)
  const deletedUser=await models.User.destroy({
    where:{
      socketId:id
    }
  })
  //console.log(deletedUser)
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
    include:[{
      model:models.FollowRequest,
      where:{
        userId:existingUser.id
      },
      as:'roomDetails',
     
    }]
  })
  console.log(JSON.stringify(roomData))
  return existingUser
}

// const getUsersInRoom = async (room) => {
//   const usersInRoom = await models.Room.findAll({
//     where: {
//       roomName: room
//     },
//     required: true,
//     include: [{
//       model: models.User,
//       as: 'roomDetails'
//     }]
//   });
//   return usersInRoom
// }
const getUsersInRoom =async (req,res)=>{
  const usersInRoom =await models.User.findAll()
  customResponse(200, usersInRoom, res)
  return usersInRoom
}
const getFollowers = async(req,res)=>{
  const followRequests = await models.User.findOne({
    where: {
        name: req.params.userName
    }

})
var follow = await models.FollowRequest.findAll({
    where: {
        followingId: followRequests.id,
        accept :true
    },
    include: [{
        model: models.User,
        as: 'userDetails',
        required: true
    }]

})
console.log(follow.length)
 if(follow.length<1)
 {
   console.log("hi")
  follow = await models.FollowRequest.findAll({
  where: {
      userId: followRequests.id,
      accept :true
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
const getRoomData=async(req,res)=>{
  console.log(req.params.userName,req.params.followingName)
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
  include:[{
    model:models.FollowRequest,
    where:{
      userId:userRequesting.id,
      followingId:user.id
    },
    as:'roomDetails',
   
  }]
})
console.log(roomData)
if(roomData===null)
{
   roomData = await models.Room.findOne({
    include:[{
      model:models.FollowRequest,
      where:{
        userId:user.id,
        followingId:userRequesting.id
      },
      as:'roomDetails',
     
    }]
  })
  console.log(roomData)
}
customResponse(200, roomData, res)
}
module.exports = { addUser, removeUser, getUser, getUsersInRoom ,getFollowers,getRoomData};