const models=require('../models')
const createUser = async (req, res, next) => {
    try {
        
        const users = await models.User.findOne({
            where: {
                name: req.body.name
            }
        });
        if(users)
        {
            res.status(200).json({
                message:"Username already exists"
            })
        }
        else
        {
            const user = await models.User.create(req.body)
            res.status(201).json({
                user,
                message:"Signup success"
        })
    }
}
    catch (error) {
        res.status(404).json({
            success: false,
            message: "could not signup",
            error
        })
        next(error)
    }
}

module.exports = createUser