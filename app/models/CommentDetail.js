import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const CommentSchema = new Schema({
   user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
   },
   reply_with: {
      type: Object,
   },
   content: {
      type: String,
      required: true,
   },
   likes: {
      type: Number,
      required: true,
      default: 0,
   },
   replies: {
      type: Number,
      required: true,
      default: 0,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('comment', CommentSchema);
