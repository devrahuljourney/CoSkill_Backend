const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema

const skillSchema = new Schema({
    name:     { type: String, required: true, unique: true },
    category: { type: String } 
  });
  
  module.exports = mongoose.model('Skill', skillSchema);
  