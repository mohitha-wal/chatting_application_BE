const express = require("express");

const router = express.Router();
const {followRequest,acceptFollowRequest,declineFollowRequest,getFollowRequests}=require('../controllers/followRequest')
const {getFollowers,getUsersInRoom,getRoomData} = require('../controllers/users')
const {addMessage,getMessages} = require('../controllers/messages')
const socket=require('../controllers/socket')
const signup=require('../controllers/signUp')
const login=require('../controllers/login')
const decodeToken=require('../tokenVerification/tokenVerification')

router.post("/follow-requests",followRequest)
router.post('/accept-follow-request',acceptFollowRequest)
router.post('/decline-follow-request',decodeToken,declineFollowRequest)
router.get('/get-follow-requests/:userName',decodeToken,getFollowRequests)
router.post('/signup',signup)
router.post('/login',login)
router.get('/add-message',decodeToken,addMessage)
router.get('/get-followers/:userName',decodeToken,getFollowers)
router.get('/get-users/:userName',decodeToken,getUsersInRoom)
router.get('/get-room/:followingName/:userName',decodeToken,getRoomData)
router.get('/get-messages/:name/:roomName',getMessages)
module.exports = router;