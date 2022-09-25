const httpStatus = require("http-status");
const config = require("../config/config");
const { AuthNotifications } = require("../notifications");
const Auth = require("../notifications/auth.notification");
const COMMON = require("../notifications/common.notification");
const User = require("../notifications/user.notification");
const { AuthServices, UserServices, EmailServices, TokenServices } = require("../services");
const ErrorHandler = require("../utils/errorHandler");
const { formateMessage } = require("../utils/helpers");

class AuthController extends ErrorHandler{

  async sendOTP(req, res, next) {
    const {  email  = '' } = req.body
    const OTP = await AuthServices.generateOTP();
    const expiryTime = Date.now() + config.OTPExpiryDefaultTime;
    const hashedOTP = await AuthServices.bcryptText(`${email}.${OTP}.${expiryTime}`);
    AuthServices.generateDummyHash();
    try {
      //send OTP
      await EmailServices.sendOtpByEmail(email, OTP)

      res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        message: formateMessage(AuthNotifications.OTP.SUCCESS_EMAIL_SEND, { email }),
        hash: `${hashedOTP}&&${email}&&${expiryTime}`,
      })
    } catch (error) {
      this.handleOperationErrors(res, error, AuthNotifications.OTP.FAILED_TO_SEND)
    }
  }

  async verifyOTP(req, res, next){
    const { otp = "", hashedText = ""} = req.body
    const [hashedOTP, email, expiryTime] = hashedText.split("&&")
    //check expiry
    const isExpired = AuthServices.checkOTPExpiry(expiryTime);
    if(isExpired){
      return res.status(httpStatus.UNAUTHORIZED).json({
        statusCode: httpStatus.UNAUTHORIZED,
        error: AuthNotifications.OTP.EXPIRED
      })
    }
    // verifying user inputs
    const isValid = AuthServices.compareHash(`${email}.${otp}.${expiryTime}`, hashedOTP);
    const statusCode = httpStatus[isValid ? 'OK' : 'UNAUTHORIZED'];
    const { SUCCESS, OTP: { INVALID } } = AuthNotifications;
    //return response if not valid otp provided
    if(!isValid){
      return res.status(statusCode).json({
        statusCode,
        error: INVALID,
      });
    }

    const user = await UserServices.createUser({
      email,
      verifiedFrom: 'email',
      isVerified: true
    })

    const { accessToken, refreshToken } = TokenServices.generateTokens({ _id: user._id })
    TokenServices.storeRefreshToken(refreshToken, user._id)
    
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    })

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    })

    return res.status(statusCode).json({
      statusCode,
      message: SUCCESS,
      user,
      isAuthenticated: true
    });
  }

  async performAutoLogin (req, res, next){
    const {
      refreshToken: refreshTokenFromCookie,
      accessToken: accessTokenFromCookie
    } = req.cookies;

    if(!refreshTokenFromCookie || !accessTokenFromCookie){
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.UNAUTHORIZED,
        error: Auth.USER.UNAUTHORIZED,
      })
    }

    let userData;
    try {
      userData = await TokenServices.verifyToken(
        refreshTokenFromCookie,
        "refresh"
      )
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        statusCode: httpStatus.UNAUTHORIZED,
        error: Auth.TOKEN.INVALID,
      })
    }

    const authenticatedUser = await UserServices.getUserById(userData._id);

    if(!authenticatedUser){
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        error: User.ERRORS.NOT_FOUND,
      })
    }

    const { accessToken, refreshToken } = await TokenServices.generateTokens({
      _id: authenticatedUser._id
    });

    try {
      const token = await TokenServices.updateRefreshToken(
        { userId : userData._id },
        { refreshToken }
      );
      if(!token){
        return res.status(httpStatus.UNAUTHORIZED).json({
          statusCode: httpStatus.UNAUTHORIZED,
          error: Auth.TOKEN.INVALID,
        })
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        error: COMMON.INTERNAL_SERVER_ERROR,
      })
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    })

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    })

    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: AuthNotifications.SUCCESS,
      user: authenticatedUser,
      isAuthenticated: true
    });
  }

  async perfomManualLogin (req, res, next) {
    const { username, password } = req.body
    try {
      const user = await UserServices.getUserByKey("userName", username)
      if(!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          statusCode: httpStatus.NOT_FOUND,
          error: "User not found"
        })
      };

      const isAuthenticated = AuthServices.compareHash(password, user?.password);
      if(!isAuthenticated){
        return res.status(httpStatus.UNAUTHORIZED).json({
          statusCode: httpStatus.UNAUTHORIZED,
          isUserLogOut: true,
          error: "Invalid credentials"
        })
      }

    const isTokenExist = await TokenServices.getRefreshToken({ userId: user._id });

    const { accessToken, refreshToken } = TokenServices.generateTokens({ _id: user._id })

    try {
      
      if(isTokenExist){
        const token = await TokenServices.updateRefreshToken(
          { userId : user._id },
          { refreshToken }
        );
        if(!token){
          return res.status(httpStatus.UNAUTHORIZED).json({
            statusCode: httpStatus.UNAUTHORIZED,
            isUserLogOut: true,
            error: Auth.TOKEN.INVALID,
          })
        }
      }else {
        const token = TokenServices.storeRefreshToken(refreshToken, user._id)
        if(!token){
          return res.status(httpStatus.UNAUTHORIZED).json({
            statusCode: httpStatus.UNAUTHORIZED,
            error: Auth.TOKEN.INVALID,
            isUserLogOut: true,
          })
        }
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        error: COMMON.INTERNAL_SERVER_ERROR,
      })
    }
    
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    })

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    })

    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: AuthNotifications.SUCCESS,
      user,
      isAuthenticated: true
    });

    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        error: COMMON.INTERNAL_SERVER_ERROR,
      })
    }
  }

  async handleLogout (req, res, next) {

    const { refreshToken } = req.cookies

    try {
      await TokenServices.removeTokens(refreshToken)
    
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
  
      res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        isLoggedOut: true
      })
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        isLoggedOut: false
      })
    }
  }
}

module.exports = new AuthController();