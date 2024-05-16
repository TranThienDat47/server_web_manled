import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const ProductDetailSchema = new Schema(
   {
      product_id: {
         type: Schema.Types.ObjectId,
         ref: 'products',
         required: true,
      },
      video_ref: {
         type: Array,
      },
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
      },
      image: {
         type: String,
      },
      episode: {
         type: String,
         default: 'Full',
      },
      child_restriction: {
         type: Boolean,
      },
      _state: {
         type: String,
         default: 'Công khai',
      },
      views: {
         type: Number,
         default: 0,
         required: true,
      },
      count_comments: {
         type: Number,
         default: 0,
         required: true,
      },
      reacts: {
         type: Number,
         default: 0,
         required: true,
      },
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('product_details', ProductDetailSchema);
