const httpStatus = require('http-status');
const { AuthNotifications } = require('../notifications');
const { TokenServices } = require('../services');
const ErrorHandler = require('../utils/errorHandler');

module.exports = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if(!accessToken){
      throw new ErrorHandler(httpStatus.UNAUTHORIZED, AuthNotifications.USER.UNAUTHORIZED);
    }

    const userData = await TokenServices.verifyToken(accessToken, "access");
    if(!userData){
      throw new ErrorHandler(httpStatus.UNAUTHORIZED, AuthNotifications.USER.UNAUTHORIZED);
    }

    req.user = userData;
    next();
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).json({
      statusCode: httpStatus.UNAUTHORIZED,
      error: error?.message
    })
  }
}