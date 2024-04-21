import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const ThumbnailVideochema = new Schema({
   videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoInfo',
   },
   timemark: String,
   image: String,
});

export default mongoose.model('thumbnail_video', ThumbnailVideochema);
