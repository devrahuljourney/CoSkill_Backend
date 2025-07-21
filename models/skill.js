const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema

const skillSchema = new Schema({
    name:     { type: String, required: true, unique: true },
    category: { type: String } ,
    users : [{
      type: Schema.Types.ObjectId,
      ref :"User"
    }],
  });
  
  module.exports = mongoose.model('Skill', skillSchema);
  