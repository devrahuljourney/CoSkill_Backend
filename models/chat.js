const chatSchema = new Schema({
    exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange' },
    messages: [{
      senderId:  { type: Schema.Types.ObjectId, ref: 'User' },
      text:      { type: String },
      timestamp: { type: Date, default: Date.now }
    }]
  });
  
  module.exports = mongoose.model('Chat', chatSchema);
  