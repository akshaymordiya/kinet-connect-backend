
const Auth = {
  SUCCESS: "Authenticated Successfully",
  OTP: {
    FAILED_TO_SEND: "Failed to send otp, please try again",
    SUCCESS_EMAIL_SEND: "Otp send successfully, to {email} email address",
    EXPIRED: "OTP is expired",
    INVALID: "Invalid OTP",
    SMS_MESSAGE: "Your Kinet connect verification code is {otp}"
  },
  USER: {
    EMAIL_ALREADY_TAKEN: "Email already taken!",
    UNAUTHORIZED: "Please authenticate",
    NOT_FOUND: "User not found"
  },
  TOKEN: {
    INVALID: "Invalid token",
    FAILED_TO_UPDATE_REFRESH_TOKEN: "Failed to update refresh token"
  }
}

module.exports = Auth