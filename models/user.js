const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String },
  bio: {type : String},
  email:     { type: String, required: true, unique: true },
  number:    { type: String },
  
  profilePic:{ type: String },
  offeredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }], 
  exploreSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  meetings:     [{ type: Schema.Types.ObjectId, ref: 'Exchange' }],
  requestConnection: [{type : Schema.Types.ObjectId, ref :"User"}],
  acceptConnection : [{type : Schema.Types.ObjectId, ref : "User"}],
  requestSent: [{type : Schema.Types.ObjectId, ref : "User"}],
  jwtToken:     { type: String },
  passwordResetToken: { type: String },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
  password: {type: String, required: true},
  role: {type : String, enum : ['customer','admin'], default : 'customer'},
  city:         { type: String },
  state:        { type: String },
  expoToken: {type: String}
  
});

module.exports = mongoose.model('User', userSchema);
