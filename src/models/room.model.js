const mongoose = require('mongoose');
const { convertToJson, paginate } = require('./plugins');

const RoomSchema = new mongoose.Schema({
  topic: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  roomKey: {
    type: String,
    required: true,
    trim: true,
    uniq: true
  },
  type: {
    type: String,
    enum: ['public', 'private']
  },
  isActive: {
    type: Boolean,
    require: true,
    default: false
  },
  hostBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  speakers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    default: []
  },
  listners: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    default: []
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
}, {
  timestamps: true
});

RoomSchema.plugin(convertToJson);
RoomSchema.plugin(paginate);

const Room = mongoose.model('Room', RoomSchema, 'rooms');

module.exports = Room;