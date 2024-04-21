import pkg from 'mongoose';
const { Schema } = pkg;

const LikeCommentsSchema = new Schema({
   comment_id: {
      type: Schema.Types.ObjectId,
      ref: 'comments',
      required: true,
   },
   user_id: {
      type: Schema.Types.ObjectId,
      required: true,
   },
});

export default pkg.model('like_comments', LikeCommentsSchema);
