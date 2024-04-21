import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const VideoInfochema = new Schema({
   name: String,
   quality: {
      type: String,
      enums: ['360p', '480p', '720p', '1080p'],
      default: '360p',
   },
   m3u8Data: Buffer,
});

export default mongoose.model('video_info', VideoInfochema);
