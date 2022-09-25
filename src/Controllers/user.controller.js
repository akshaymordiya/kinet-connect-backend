const httpStatus = require("http-status");
const { UserNotifications } = require("../notifications");
const { UserServices } = require("../services");
const ErrorHandler = require("../utils/errorHandler");

class UserController extends ErrorHandler{

  async activateUserProfile(req, res, next) {
    try {
      const user = await UserServices.activeUserProfile({
        _id: req.params.userId,
        ...req.body
      });
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        message: UserNotifications.UPDATE,
        user
      })
    } catch (error) {
      console.error(error)
      return res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error: error?.message,
      })
    }
  }

  async userKeyValidator(req, res, next){
    try {
      const { key, value, excludeId = null} = req.body
      const checkIfKeyExist = await UserServices.checkIfKeyValueAlreadyExist(key, value, excludeId);
      res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        isValueExist: checkIfKeyExist
      })
    } catch (error) {
      this.handleOperationErrors(res, error)
    }
  }
}

module.exports = new UserController();