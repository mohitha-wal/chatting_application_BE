const errorCodes = {
    400: 'Bad Request',
    500: 'Internal Server Error',
    401: 'User Not Authorized',
    404: 'Not found'
}

function customResponse (statusCode, data, res) {
    if ([200, 201, 301, 206].indexOf(statusCode) > -1) {
        res.statusCode = statusCode
        res.send({
            success: true,
            data: data
        })
    } else {
        res.statusCode = statusCode
        res.send({
            success: false,
            errorCode: errorCodes[statusCode] || 'Error',
            message: data.message || data
        })
    }
}
module.exports=customResponse