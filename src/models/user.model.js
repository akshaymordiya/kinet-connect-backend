const { default: mongoose } = require("mongoose");
const { AuthServices } = require("../services");
const { isEmail } = require("../validations/custom.validation");
const { convertToJson, paginate } = require("./plugins");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    default: null
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    default: null
  },
  userName: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    default: null
  },
  avatarURL: {
    type: String,
    default: null
  },
  email:{
    type:String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
      if(!isEmail(value)){
        throw new Error('Invalid Email');
      }
    },
    default: null
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  verifiedFrom: {
    type: String,
    enum: ['email']
  },
  isActivated: {
    type: Boolean,
    required: true,
    default: false
  },
  password: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

UserSchema.plugin(convertToJson);
UserSchema.plugin(paginate);

UserSchema.statics.isKeyAlreadyExist = async function(key, value, excludeUserId){
  const user = await this.findOne({ [key]: value, _id: { $ne: excludeUserId } });
  return !!user;
}

UserSchema.statics.isPasswordMatched = async function(password){
  const hashUserEnteredPassword = AuthServices.bcryptText(password);
  return this.password === hashUserEnteredPassword
}

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;