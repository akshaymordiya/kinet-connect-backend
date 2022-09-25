const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Token } = require('../models');
const Auth = require('../notifications/auth.notification');

class TokenServices {
  generateTokens( payload ){
    const accessToken = jwt.sign(payload, config.jwt.accessTokenSecret, {
      expiresIn: "1h"
    })

    const refreshToken = jwt.sign(payload, config.jwt.refreshTokenSecret, {
      expiresIn: '1y'      
    })

    return {
      accessToken,
      refreshToken
    }
  }

  async storeRefreshToken(token, userId){
    try {
      await Token.create({
        refreshToken: token,
        userId
      })
    } catch (error) {
      console.error(error?.message)
    }
  }

  async verifyToken(token, type) {
    const types = {
      "access": "accessTokenSecret",
      "refresh": "refreshTokenSecret"
    }
    return jwt.verify(token, config.jwt[types[type]])
  }

  async getRefreshToken(payload){
    return await Token.findOne(payload)
  }

  async updateRefreshTokenById(userId, refreshToken) {
    return await Token.updateOne(
      { userId },
      { refreshToken } 
    )
  }

  async updateRefreshToken(filter, update){
    try {
      return await Token.findOneAndUpdate(filter, update, { new : true })
    } catch (error) {
      throw new ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, Auth.TOKEN.FAILED_TO_UPDATE_REFRESH_TOKEN)
    }
  }

  async removeTokens(refreshToken){
    return await Token.deleteOne({ refreshToken })
  }
}

module.exports = new TokenServices();