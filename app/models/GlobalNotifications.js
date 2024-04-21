import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const GlobalNotificationchema = new Schema(
   {
      ref_id: {
         type: pkg.Schema.Types.ObjectId,
         required: true,
      },
      title: {
         type: String,
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('global_notifications', GlobalNotificationchema);
