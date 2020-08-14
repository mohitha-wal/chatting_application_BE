const jwt = require('jsonwebtoken');
const models = require('../models')
const decodeToken = async (req, res, next) => {

    try {
        req.token = jwt.verify(req.headers['token'],'nodeauthsecret');
        console.log(req.token)
        if(req.params)
        {
            var name=req.params.userName
        }
        else{
            var name=req.body.userName
        }
        const user = await models.User.findOne({
            where:{
                name:name
            }
        })
        console.log(user)

        if(user.name==req.token.name)
        next();
        else
        throw new error("Authentication failed")
    } catch (err) {
        res.status(400).json({
            success:false,
            message:`Authentication failed, ${req.params.name} doesnt exist`
        });
    }
}
module.exports = decodeToken;