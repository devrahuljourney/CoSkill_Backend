const feedbackSchema = new Schema({
    exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange' },
    userId:     { type: Schema.Types.ObjectId, ref: 'User' },
    rating:     { type: Number, min: 1, max: 5 },
    comment:    { type: String },
    createdAt:  { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Feedback', feedbackSchema);
  