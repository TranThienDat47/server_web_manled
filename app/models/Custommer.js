import pkg from 'mongoose';
const { Schema } = pkg;

const UserSchema = new Schema(
   {
      _name: {
         type: String,
         required: true,
      },
      nickname: {
         type: String,
      },
      img: {
         type: String,
         required: true,
         default: 'https://drive.google.com/uc?export=view&id=1ZBkx0MXQcO2NSUtCeHfmqiZTkfQlVhxB',
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
      },
      is_verify: {
         type: Boolean,
         default: false,
      },
      first_name: {
         type: String,
         required: true,
      },
      last_name: {
         type: String,
         required: true,
      },
      is_block: {
         type: Boolean,
         default: false,
         required: true,
      },
   },
   {
      timestamps: true,
   },
);

export default pkg.model('users', UserSchema);
