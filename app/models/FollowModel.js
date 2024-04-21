import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const Followschema = new Schema({
   refID: {
      type: Array,
      required: true,
   },
   userID: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
   },
   counts: {
      type: Number,
      required: true,
      default: 1,
   },
});

export default mongoose.model('follows', Followschema);
