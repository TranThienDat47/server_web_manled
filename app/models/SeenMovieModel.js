import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const SeenMovieSchema = new Schema(
   {
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
   },
   {
      timestamps: { createdAt: true, updatedAt: true },
   },
);

SeenMovieSchema.index({ ref_id: 1, user_id: 1 }, { unique: true, sparse: true });

export default mongoose.model('seen_movie', SeenMovieSchema);
