import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const Followschema = new Schema({
   ref_id: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true,
   },
   user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
   },
});

export default mongoose.model('follows', Followschema);
