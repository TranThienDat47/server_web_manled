class PassportOauthGoogleController {
   async logout(req, res) {
      res.redirect('/');
   }
   async callback(req, res) {
      res.redirect(`${process.env.URL_VERIFI_GOOGLE_CLIENT}?accessToken=${req.user.token}`);
   }
}

export default new PassportOauthGoogleController();
