const models = require('../models');
const customResponse = require('../response/customResponse')
const addMessage = async (userId, roomId, message) => {
    try {
        let reqObj = {
            userId: userId,
            roomId: roomId,
            message: message

        }
        const msgRecord = await models.Messages.create(reqObj)
        //customResponse(200, msgRecord, res)

    }
    catch (error) {
        //customResponse(400, error, res)
    };
}
const getMessages = async (req, res) => {
    try {

        const msgList = await models.Messages.findAll({
            include:[
                {
                    model:models.User,
                    as:'userDetails',
                    
                },
                {
                    model:models.Room,
                    as:'roomDetails',
                    where:{roomName:req.params.roomName}
                }
            ]
        })
        customResponse(200, msgList, res)
    }
    catch (error) {
        customResponse(400, error, res)
    }
}
const getId = async (room) => {
    const roomDetails = await models.Room.findOne({
        where: {
            roomName: room
        }
    })
    console.log(roomDetails)
    return roomDetails
}
module.exports = { addMessage, getMessages, getId }