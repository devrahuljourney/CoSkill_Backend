const exchangeSchema = new Schema({
    senderId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:      { type: String, required: true },
    meetingLink:{ type: String },
    time:       { type: Date },
    learningSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    feedback: [{
      userId:  { type: Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      rating:  { type: Number, min: 1, max: 5 }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Exchange', exchangeSchema);
  