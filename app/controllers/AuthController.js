import AuthService from '../../services/AuthService.js';

class AuthController {
   async register(req, res) {
      const { username, password, first_name, last_name } = req.body;
      if (!username || !password || !first_name || !last_name)
         return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password' });

      AuthService.register({ username, password, first_name, last_name })
         .then((result) => {
            const { success, message, username, accessToken } = result;

            if (!success)
               return res.status(400).json({
                  success,
                  message,
                  username,
                  accessToken,
               });

            return res.json({
               success,
               message,
               username,
               accessToken,
            });
         })
         .catch((err) => {
            return res.status(400).json({
               success: false,
               message: 'Registed failed!',
               username: null,
               accessToken: null,
               error: err.message || err,
            });
         });
   }

   async login(req, res) {
      const { username, password } = req.body;

      if (!username || !password)
         return res.status(400).json({ success: false, message: 'Empty account' });

      AuthService.login(username, password)
         .then((result) => {
            const { success, message, is_verify, accessToken } = result;

            if (!success)
               return res.status(400).json({
                  success,
                  message,
                  is_verify,
                  accessToken,
               });

            return res.json({
               success,
               message,
               is_verify,
               accessToken,
            });
         })
         .catch((err) => {
            return res.status(400).json({
               success: false,
               message: 'Registed failed!',
               is_verify: null,
               accessToken: null,
            });
         });
   }

   async verify(req, res) {
      const email = req.query.email,
         token = req.query.token;

      if (!email || !token)
         return res.status(400).json({ success: false, message: 'Email or token is null' });

      AuthService.verify(email, token)
         .then((result) => {
            const { success, message } = result;

            if (!success)
               return res.status(401).json({
                  success: success,
                  message: message,
               });

            return res.json({
               success: success,
               message: message,
            });
         })
         .catch((err) => {
            return res.status(401).json({
               success: false,
               message: err.message,
            });
         });
   }

   async checkAccountValid(req, res) {
      const username = req.body.username;

      AuthService.getOne({ username })
         .then((result) => {
            if (result.success && result.user) {
               return res.json({
                  success: true,
                  valid: true,
                  message: result.message,
               });
            }

            return res.json({ success: true, valid: false, message: result.message });
         })
         .catch((err) => {
            return res.status(400).json({ success: false, valid: null, message: result.message });
         });
   }

   async check(req, res) {
      const user_id = req.user_id;

      AuthService.check(user_id)
         .then((result) => {
            const { success, message, is_verify, user } = result;

            if (!success)
               return res.status(400).json({ success: success, is_verify, message, user });

            return res.json({ success: success, message, is_verify, user });
         })
         .catch((err) => {
            return res
               .status(400)
               .json({ success: success, is_verify: null, message: err.message, user });
         });
   }

   async resend(req, res) {
      const { username, accessToken } = req.body;

      await AuthService.sendMailAuthorizationCustomer(username, accessToken)
         .then((result) => {
            const { success, message } = result;

            if (!success) return res.status(400).json({ success: success, message });

            return res.json({ success: success, message });
         })
         .catch((err) => {
            return res.status(400).json({ success: success, message: err.message });
         });
   }
}

export default new AuthController();
