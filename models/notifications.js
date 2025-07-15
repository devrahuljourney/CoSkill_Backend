const notificationSchema = new Schema({
    userId:   { type: Schema.Types.ObjectId, ref: 'User' },
    message:  { type: String, required: true },
    type:     { type: String, enum: ['request', 'status', 'reminder'], default: 'request' },
    isRead:   { type: Boolean, default: false },
    createdAt:{ type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Notification', notificationSchema);
  