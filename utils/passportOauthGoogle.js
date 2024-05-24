import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import AuthService from '../services/AuthService.js';

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.CALLBACK_URL_PASSPORT,
      },
      async (accessToken, refreshToken, profile, done) => {
         const check = await AuthService.getOne({ username: profile._json.email || 'null' });

         if (check.success && check.user) {
            const token = jwt.sign({ user_id: check.user._id }, process.env.ACCESS_TOKEN_SECRET);

            done(null, { token });
         } else {
            const result = await AuthService.loginWithPassport({
               username: profile._json.email,
               img: profile._json.picture,
               first_name: profile._json.given_name,
               last_name: profile._json.family_name,
            });

            done(null, { token: result.accessToken });
         }
      },
   ),
);

export default passport;
