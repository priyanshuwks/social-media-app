const jwt = require('jsonwebtoken');
const {error, success} = require('../utils/responseWrapper')
module.exports = async (req, res, next) => {
    console.log('I am a middleware');
    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        // return res.status(401).json({
        //     status : 'failed, authorization header is required'
        // })
        return res.send(error(401, 'faile, authorization header is required'));
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    console.log(accessToken);
    try{
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);

    }catch(error){
        console.log(error);
        // return res.status(401).json({
        //     message : 'invalid access key'
        // })
        return res.send(error(401, 'Invalid access key'))
    }
    next();
}