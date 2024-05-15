import pkg from 'mongoose';
const { Schema } = pkg;

const LikeProductDetailSchema = new Schema({
   parrent_id: {
      type: Schema.Types.ObjectId,
      ref: 'product_details',
      required: true,
   },
   user_id: {
      type: Schema.Types.ObjectId,
      required: true,
   },
});

LikeProductDetailSchema.index({ parrent_id: 1, user_id: 1 }, { unique: true, sparse: true });

export default pkg.model('like_product_details', LikeProductDetailSchema);
