import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const TSFilechema = new Schema({
   videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoInfo',
   },
   name: {
      type: String,
      index: true,
   },
   tsData: Buffer,
});

export default mongoose.model('ts_file', TSFilechema);
