const httpStatus = require("http-status");
const User = require("../models/user.model");
const { AuthNotifications, UserNotifications } = require("../notifications");
const ErrorHandler = require("../utils/errorHandler");
const { AuthServices } = require(".");
const Jimp = require('jimp');
const path = require('path');
const { omit } = require("../utils/helpers");
const config = require("../config/config");
const { allowedMIMETypes } = require("../validations/user.validation");

class UserServices {

  async createUser(userBody) {
    if(userBody?.email && ( await this.checkIfKeyValueAlreadyExist('email', userBody.email))){
      throw new ErrorHandler(httpStatus.BAD_REQUEST, AuthNotifications.USER.EMAIL_ALREADY_TAKEN)
    }
    
    return User.create(userBody)
  }

  async getUserById(id) {
    return await User.findById(id)
  }

  async getUserByKey(key, value) {
    return await User.findOne({ [key]: value})
  }

  generateSlugByFullname(fullname) {
    return fullname.split(" ").map((key) => String(key).toLowerCase()).join("-");
  }

  async checkIfKeyValueAlreadyExist(key, value, excludeId = null) {
    const isExist = await User.isKeyAlreadyExist(key, value, excludeId)
    return isExist;
  }

  mappedUserData(user) {
    return omit(user._doc, ['password']);
  }

  async updateUserById(filter, update){
    try {
      const updateUser = await User.findOneAndUpdate(filter, update, { new : true })
      return updateUser;
    } catch (error) {
      throw new ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, UserNotifications.ERRORS.FAILED_TO_UPDATE)
    }
  }

  async uploadUserAvatar(avatar) {
    if(!avatar || ['male', 'female'].includes(avatar)){
      return avatar;
    }

    const mimeType = avatar.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
    const extenstion = mimeType.split("/")[1];

    if(!allowedMIMETypes.includes(extenstion)){
      throw new ErrorHandler(httpStatus.BAD_REQUEST, UserNotifications.ERRORS.INVALID_IMAGE_TYPE)
    }

    const imagePath = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${extenstion}`;

    const buffer = Buffer.from(avatar.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
    try {
      const jimpRes = await Jimp.read(buffer);
      jimpRes.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../../public/storage/${imagePath}` ));
      return `${config.appUrl}storage/${imagePath}`
    } catch (error) {
      console.error(error)
      throw new ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async activeUserProfile(userData){

    let isProfileReadyToActivate = false;
    if(userData?.userName && ( await this.checkIfKeyValueAlreadyExist('userName', userData?.userName, userData?._id))){
      throw new ErrorHandler(httpStatus.BAD_REQUEST, UserNotifications.ERRORS.USERNAME_ALREADY_EXIST);
    }

    isProfileReadyToActivate = ['fullName', 'userName', 'password'].every((key) => userData[key])
    if(!isProfileReadyToActivate){
      throw new ErrorHandler(httpStatus.BAD_REQUEST, UserNotifications.ERRORS.FAILED_TO_ACTIVATE)
    }

    const slug = this.generateSlugByFullname(userData?.fullName)
    const password = AuthServices.bcryptText(userData?.password);
    const avatarURL = await this.uploadUserAvatar(userData?.avatarURL);

    const payload = {
      ...omit(userData, ['_id', 'id', 'password']),
      slug,
      password,
      avatarURL,
      isActivated: isProfileReadyToActivate
    }
    const activatedUserData = await this.updateUserById({ _id: userData?._id}, payload)
    return activatedUserData;
  }
}

 module.exports = new UserServices();