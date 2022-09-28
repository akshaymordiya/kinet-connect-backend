const httpStatus = require("http-status");
const { CommonNotifications, roomNotifications } = require("../notifications");
const RoomService = require("../services/room.service");
const ErrorHandler = require("../utils/errorHandler");
const moment = require('moment');

class RoomController {
  
  index(){
    //get all activated rooms

  }

  async createRoom(req, res, next) {
    try {
      const { hostBy, topic, description, type } = req?.body
      if(hostBy !== req.user._id){
        throw ErrorHandler(httpStatus.BAD_REQUEST, roomNotifications.ERROR.AUTHENTICATED_HOST_ERROR)
      }
      
      const payload = {
        topic,
        description,
        hostBy: req.user._id,
        type,
        roomKey: RoomService.generateUniqRoomKey(),
        startTime : Date.now(),
        isActive: true
      }

      const newRoom = await RoomService.createRoom(payload);
      if(!newRoom){
        throw ErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, roomNotifications.ERROR.FAILED_TO_CREATE)
      }

      return res.status(httpStatus.OK).json({
        message: roomNotifications.SUCCESS.CREATED,
        statusCode: httpStatus.OK,
        room: newRoom
      });

    } catch (error) {
      console.error(error);
      return res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error: error?.message || CommonNotifications.INTERNAL_SERVER_ERROR,
      })
    }
  }
  

  joinRoom(){
    //joining the room
  }

  addUserInTheOngoingRoom() {
    //add user to the ongoing room
  }

}

module.exports = new RoomController();