const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  number:    { type: String,  unique: true },
  
  profilePic:{ type: String },
  offeredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }], 
  exploreSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  meetings:     [{ type: Schema.Types.ObjectId, ref: 'Exchange' }],
  jwtToken:     { type: String },
  passwordResetToken: { type: String },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
  password: {type: String, required: true},
  
});

module.exports = mongoose.model('User', userSchema);
