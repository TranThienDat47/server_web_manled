import mongoose from 'mongoose';
import pkg from 'mongoose';
const { Schema } = pkg;

const ProductsSchema = new Schema(
   {
      _name: {
         type: String,
         required: true,
      },
      anotherName: {
         type: String,
      },
      description: {
         type: String,
      },
      img: {
         type: String,
      },
      background: {
         type: String,
      },
      _status: {
         type: String,
         // enum: [
         //    'Chờ công khai',
         //    'Lên lịch',
         //    'Công khai',
         //    'Đã hoàn thành',
         //    'Đang thực hiện',
         //    'Sắp chiếu',
         // ],
         default: 'Sắp chiếu',
      },
      episodes: {
         type: String,
         default: '??',
      },
      currentEpisodes: {
         type: String,
         default: '??',
      },
      view: {
         type: Number,
         default: 0,
      },
      releaseDate: {
         type: Date,
      },
      news: {
         type: Boolean,
         default: true,
      },
      reacts: {
         type: Number,
         default: 0,
      },
      country_of_origin: {
         type: String,
      },
      categories: {
         type: [Object], //[{_id, title}]
      },
      keySearch: {
         type: String,
      },
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('products', ProductsSchema);
