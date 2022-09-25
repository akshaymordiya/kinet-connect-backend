const mongoose = require('mongoose');
const { convertToJson, paginate } = require('./plugins');

const TokenSchema = mongoose.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }
}, {
  timestamps: true
});

TokenSchema.plugin(convertToJson);
TokenSchema.plugin(paginate);

const Token = mongoose.model('Token', TokenSchema, 'tokens');

module.exports = Token;