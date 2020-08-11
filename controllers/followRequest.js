const models = require('../models')
const faker = require('faker')
const { uniqueNamesGenerator, Config, names } = require('unique-names-generator');
const customResponse = require('../response/customResponse')
const followRequest = async (req, res) => {
    try {
        const user = await models.User.findOne({
            where: {
                name: req.body.followingName
            }
        })
        const userRequesting = await models.User.findOne({
            where: {
                name: req.body.userName
            }
        })
        obj = {
            userId: userRequesting.id,
            followingId: user.id,
            accept: false
        }
        existingRequest = await models.FollowRequest.findOne({
            where:{
                userId: userRequesting.id,
            followingId: user.id,
            }
        })
        if(existingRequest)
        throw new error("Already requested")
        const request = await models.FollowRequest.create(obj)
        customResponse(200, request, res)
    }
    catch (error) {
        customResponse(400, error, res)
    }
}
const getFollowRequests = async (req, res) => {
    try {
        const followRequests = await models.User.findOne({
            where: {
                name: req.params.name
            }

        })
        const follow = await models.FollowRequest.findAll({
            where: {
                followingId: followRequests.id
            },
            include: [{
                model: models.User,
                as: 'userDetails',
                required: true
            }]

        })
        console.log(JSON.stringify(follow))

        customResponse(200, follow, res)
    }
    catch (error) {
        customResponse(400, error, res)
    }
}
const acceptFollowRequest = async (req, res) => {
    try {
        //console.log("hii")
        const followedUser = await models.User.findOne({
            where: {
                name: req.body.followingName
            }
        })
        const user = await models.User.findOne({
            where: {
                name: req.body.userName
            }
        })
        const randomName = uniqueNamesGenerator({ dictionaries: names });
        let roomObj = {
            roomName: randomName
        }
        const room = await models.Room.create(roomObj)
        let reqObj = {
            roomId: room.id,
            accept: true
        }
        console.log(followedUser.id,user.id)
        const request = await models.FollowRequest.update(reqObj,
            {
                where: {
                    followingId: user.id,
                    userId:followedUser.id
                }
            })

        res.status(200).json({
            message: 'Follow request Accepted',
            data: request
        })
    }
    catch (error) {
        res.status(400).json({
            message: 'Unable to sent follow request',
            error: error
        })
    }
}
const declineFollowRequest = async (req, res) => {
    try {
        const followedUser = await models.User.findOne({
            where: {
                name: req.params.followingName
            }
        })
        console.log(followedUser)
        const user = await models.User.findOne({
            where: {
                name: req.params.userName
            }
        })
        console.log(user)
        const request = await models.FollowRequest.destroy({
            where: {
                userId: user.id,
                followingId:followedUser.id

            }
        })
        console.log(request)
        res.status(200).json({
            message: 'Follow request Declined',
            data: request
        })
    }
    catch (error) {
        res.status(404).json({
            message: 'Unable to decline follow request',
            error: error
        })
    }
}

module.exports = { followRequest, acceptFollowRequest, declineFollowRequest, getFollowRequests }