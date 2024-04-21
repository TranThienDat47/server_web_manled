import express from 'express';

import passport from '../utils/passportOauthGoogle.js';
import passportOauthGoogleController from '../app/controllers/PassportOauthGoogleController.js';

const router = express.Router();

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
   '/callback',
   passport.authenticate('google', {
      failureRedirect: `${process.env.URL_VERIFI_GOOGLE_CLIENT}?success=false&&message="huhu"`,
      session: false,
   }),
   passportOauthGoogleController.callback,
);

router.get('/logout', passportOauthGoogleController.logout);

export default router;
