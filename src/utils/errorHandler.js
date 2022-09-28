const httpStatus = require("http-status");

class ErrorHandler extends Error {
  constructor(statusCode, message, isOperational = true, stack = ''){
    super(message);
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.message = message
    if(stack){
      this.stack = stack;
    }else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  handleOperationErrors(res, error, errorMessage = null, statusCode = httpStatus.INTERNAL_SERVER_ERROR){
    console.error(error);
    return res.status(statusCode).json({
      statusCode,
      error: errorMessage || error,
    })
  }
}

module.exports = ErrorHandler