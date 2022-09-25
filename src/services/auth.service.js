const crypto = require('node:crypto');
const config = require('../config/config');

class AuthServices {

  generateOTP() {
    return crypto.randomInt(1000,9999);
  }

  bcryptText(text){
    return crypto.createHmac('sha256', config.secretKeys.hash)
                .update(text)
                .digest('hex');
  }

  checkOTPExpiry(expiryTime){
    return Date.now() > expiryTime
  }

  compareHash(text = "", hashedText = ""){
    const argHashedText = this.bcryptText(text);
    return argHashedText === hashedText;
  }


  generateDummyHash(){
    console.log(crypto.randomBytes(64).toString('hex'));
  }

}

module.exports = new AuthServices();