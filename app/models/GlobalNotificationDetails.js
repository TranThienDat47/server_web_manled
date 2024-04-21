import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const GlobalNotificationDetailchema = new Schema({
   gloab_notification_id: {
      type: pkg.Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
   },
   user_id: {
      type: pkg.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
   },
   read: {
      type: Boolean,
      required: true,
      default: false,
   },
});

export default mongoose.model('global_notification_details', GlobalNotificationDetailchema);
