import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/web-flim';
const options = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   family: 4,
};

// const connectDB = async () => {
//    try {
//       await mongoose.connect(url, options);
//       console.log('MongoDB connected');
//    } catch (error) {
//       console.log(error);
//       process.exit(1);
//    }
// };

const connectDB = async () => {
   try {
      await mongoose.connect(
         `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rdlf0om.mongodb.net/test`,
         {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         },
      );
      console.log('MongoDB connected');
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

export default { connectDB };
