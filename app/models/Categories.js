import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const Categorieschema = new Schema({
   parentID: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: null,
   },
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      default: '',
   },
});

export default mongoose.model('categories', Categorieschema);
