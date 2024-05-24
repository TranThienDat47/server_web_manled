import pkg from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import User from '../app/models/Custommer.js';

import MailServices from './MailServices.js';

const { sanitizeFilter } = pkg;

class AuthService {
   async register({ username, password, first_name, last_name }) {
      try {
         const filter = { username };

         const user = await User.findOne(filter);
         if (user)
            return {
               success: false,
               message: 'Username already taken',
               username,
               accessToken: null,
            };

         const hashedPassword = await argon2.hash(password);
         const newUser = new User(
            sanitizeFilter({
               username,
               password: hashedPassword,
               _name: first_name + ' ' + last_name,
               first_name,
               last_name,
            }),
         );

         await newUser
            .save()
            .then()
            .catch((err) => {
               return {
                  success: false,
                  message: 'Register failed!',
                  username: null,
                  accessToken: null,
                  error: err.message || err,
               };
            });

         const accessToken = jwt.sign({ user_id: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

         await this.sendMailAuthorizationCustomer(username, accessToken);

         return {
            success: true,
            message: 'User create successfully',
            username,
            accessToken,
         };
      } catch (error) {
         return {
            success: false,
            message: 'Register failed!',
            username: null,
            accessToken: null,
            error: error.message || error,
         };
      }
   }

   async login(username, password) {
      try {
         const user = await User.findOne(sanitizeFilter({ username }));

         if (!user)
            return {
               success: false,
               message: 'Incorrect username OR password!',
               is_verify: false,
               accessToken: null,
            };

         const passwordValid = await argon2
            .verify(user.password, password)
            .then((res) => {
               if (res) {
                  return true;
               } else return false;
            })
            .catch((error) => ({
               success: false,
               message: error.message.message,
               is_verify: false,
               accessToken: null,
            }));

         if (!passwordValid)
            return {
               success: false,
               message: 'Incorrect username OR password!',
               is_verify: false,
               accessToken: null,
            };

         const accessToken = jwt.sign({ user_id: user._id }, process.env.ACCESS_TOKEN_SECRET);

         if (!user.is_verify) {
            try {
               if ((await this.sendMailAuthorizationCustomer(username, accessToken)).success)
                  return {
                     success: true,
                     message: 'Login successfully',
                     is_verify: false,
                     accessToken,
                  };
            } catch (error) {
               return {
                  success: false,
                  message: 'Incorrect username OR password!',
                  is_verify: false,
                  accessToken: null,
               };
            }
         }

         return {
            success: true,
            message: 'Login successfully',
            is_verify: true,
            accessToken,
         };
      } catch (error) {
         return {
            success: true,
            message: error.message.message,
            is_verify: false,
            accessToken,
         };
      }
   }

   async verify(email, token) {
      const isvalid = await argon2
         .verify(token, email)
         .then((argon2Match) => {
            if (argon2Match) {
               return true;
            }
         })
         .catch((error) => ({
            success: false,
            message: error.message.message,
         }));

      if (isvalid) {
         const filter = sanitizeFilter({
            username: email,
         });

         const updateDoc = {
            is_verify: true,
         };

         const updatedProducts = await User.findOneAndUpdate(filter, updateDoc);

         if (!updatedProducts)
            return {
               success: false,
               message: 'Products not found or user not authorised',
            };

         return { success: true, message: 'verify successfully' };
      }
   }

   async check(user_id, res) {
      try {
         const user = await User.findById(user_id).select('-password');
         if (!user)
            return {
               success: false,
               message: 'User not found',
               is_verify: false,
               user: null,
            };
         return { success: true, message: '', is_verify: user.is_verify, user };
      } catch (error) {
         return {
            success: false,
            message: error.message.message,
            is_verify: null,
            user: null,
         };
      }
   }

   async sendMailAuthorizationCustomer(email, accessToken) {
      try {
         const hashMail = await argon2.hash(email);

         const result = await MailServices.sendHtmlMail(
            [email],
            'MANLED web account verification',
            `<a href="https://${process.env.URL_VERIFY}/verify?email=${email}&token=${hashMail}&hashToken=${accessToken}">Please click here to confirm!</a>`,
         );

         return { success: true, message: 'Send Mail successfully' };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async getOne(filter = {}) {
      try {
         const user = await User.findOne(sanitizeFilter(filter));

         if (!user)
            return {
               success: true,
               user: user,
               message: 'Incorrect username OR password!',
            };

         return {
            success: true,
            message: 'Login successfully',
            user,
         };
      } catch (error) {
         return {
            success: true,
            message: error.message.message,
         };
      }
   }

   async loginWithPassport({
      username = '',
      img = 'https://drive.google.com/thumbnail?id=1ZBkx0MXQcO2NSUtCeHfmqiZTkfQlVhxB',
      first_name = '',
      last_name = '',
   }) {
      try {
         const newUser = new User(
            sanitizeFilter({
               username,
               is_verify: true,
               img,
               first_name,
               last_name,
               _name: first_name + ' ' + last_name,
            }),
         );
         await newUser.save();

         const accessToken = jwt.sign({ user_id: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

         return {
            success: true,
            message: 'User create successfully',
            username,
            accessToken,
         };
      } catch (error) {
         return {
            success: false,
            message: error.message,
            username: null,
            accessToken: null,
         };
      }
   }
}

export default new AuthService();
