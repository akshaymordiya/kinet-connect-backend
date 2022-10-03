const httpStatus = require('http-status');
const crypto = require('node:crypto');
const Room = require('../models/room.model');
const { CommonNotifications } = require('../notifications');
const ErrorHandler = require('../utils/errorHandler');

class RoomService {
  async createRoom(payload) {
    try {
      return await Room.create(payload)
    } catch (error) {
      throw ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, CommonNotifications.INTERNAL_SERVER_ERROR)
    }
  }

  async getGlobalRooms(){
    return await Room.where()
  }

  async getHostActiveRoom(hostId){
    try {
      return await Room.find({ hostBy: hostId, isActive: true })
                      .populate('hostBy')
                      .populate('listners')
                      .populate('speakers')
                      .exec();
    } catch (error) {
      throw ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, CommonNotifications.INTERNAL_SERVER_ERROR)
    }
  }
  
  async destroyHostActiveRoom(hostId, roomKey){
    try {
      return await Room.deleteOne({ hostBy: hostId, isActive: true, roomKey})
    } catch (error) {
      throw ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, CommonNotifications.INTERNAL_SERVER_ERROR)
    }
  }

  generateUniqString(length){
    return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0,length);
  }
  
  generateUniqRoomKey() {
    const length = 4;
    let string = "";
    let count = 1;
    while (count <= length) {
      const uniqStr = this.generateUniqString(length);
      string = count === length ? `${string}${uniqStr}` : `${string}${uniqStr}-`
      count += 1
    }

    return string;
  }
}

module.exports = new RoomService();