const crypto = require('node:crypto');
const Room = require('../models/room.model');

class RoomService {
  async createRoom(payload) {
    return await Room.create(payload)
  }

  async getGlobalRooms(){
    return await Room.where()
  }

  async getRoom(){
    //fetch room details
  }

  generateUniqString(length){
    return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0,length).toUpperCase();
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