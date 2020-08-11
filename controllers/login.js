const models=require('../models')
const jwt=require('jsonwebtoken')
const login = async (req, res, next) => {
console.log("hhloooooooooooooooo")
    const user = await models.User.findOne({
        where: {
            name: req.body.name,
        }
    })
    if (!user) {
        return res.status(201).json({
            success: false,
            msg: 'Authentication failed. User not found.',
        });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
            var token = jwt.sign({ name: req.body.name }, 'nodeauthsecret');
            console.log(token,jwt.decode(token))
            res.status(201).json({ success: true, token: token, user: user, msg: 'login successful' });
        } else {
            res.status(201).send({ msg: 'Authentication failed. Wrong password.' });
        }
    })
}

module.exports = login;