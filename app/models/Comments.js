import pkg from 'mongoose';
const { Schema } = pkg;

const CommentsSchema = new Schema({
   parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true,
   },
   counts: {
      type: Number,
      default: 1,
   },
   comment_details: {
      type: Array,
      required: true,
   },
});

export default pkg.model('comments', CommentsSchema);
