import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const SeeLaterMoviesSchema = new Schema(
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
      timestamps: { createdAt: true, updatedAt: false },
   },
);

SeeLaterMoviesSchema.index({ ref_id: 1, user_id: 1 }, { unique: true, sparse: true });

export default mongoose.model('see_later_movies', SeeLaterMoviesSchema);
