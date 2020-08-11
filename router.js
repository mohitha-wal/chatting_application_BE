const express = require("express");
const router = express.Router();
const {followRequest,acceptFollowRequest,declineFollowRequest,getFollowRequests}=require('./controllers/followRequest')
const {getFollowers,getUsersInRoom,getRoomData} = require('./controllers/users')
const {addMessage,getMessages} = require('./controllers/messages')
const socket=require('./controllers/socket')
const signup=require('./controllers/signUp')
const login=require('./controllers/login')
// router.get("/",socket);
router.post("/follow-requests",followRequest)
router.post('/accept-follow-request',acceptFollowRequest)
router.delete('/decline-follow-request/:followingName/:userName',declineFollowRequest)
router.get('/get-follow-requests/:name',getFollowRequests)
router.post('/signup',signup)
router.post('/login',login)
router.get('/add-message',addMessage)
router.get('/get-followers/:userName',getFollowers)
router.get('/get-users',getUsersInRoom)
router.get('/get-room/:followingName/:userName',getRoomData)
router.get('/get-messages/:name/:roomName',getMessages)
module.exports = router;