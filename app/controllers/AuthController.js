import { HttpMessage, HttpStatus } from '../../global/enumGlobal.js';
import AuthService from '../../services/AuthService.js';

class AuthController {
   async register(req, res) {
      const { username, password, first_name, last_name } = req.body;
      if (!username || !password || !first_name || !last_name)
         return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ success: false, message: HttpMessage.BAD_REQUEST });

      AuthService.register({ username, password, first_name, last_name })
         .then((result) => {
            const { success, message, username, accessToken } = result;

            if (!success)
               return res.status(HttpStatus.BAD_REQUEST).json({
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
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
               success: false,
               message: HttpMessage.INTERNAL_SERVER_ERROR,
               username: null,
               accessToken: null,
               error: err.message || err,
            });
         });
   }

   async login(req, res) {
      const { username, password } = req.body;

      if (!username || !password)
         return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ success: false, message: HttpMessage.BAD_REQUEST });

      AuthService.login(username, password)
         .then((result) => {
            const { success, message, is_verify, accessToken } = result;

            if (!success)
               return res.status(HttpStatus.BAD_REQUEST).json({
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
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
               success: false,
               message: HttpMessage.INTERNAL_SERVER_ERROR,
               is_verify: null,
               accessToken: null,
            });
         });
   }

   async verify(req, res) {
      const email = req.query.email,
         token = req.query.token;

      if (!email || !token)
         return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ success: false, message: HttpMessage.BAD_REQUEST });

      AuthService.verify(email, token)
         .then((result) => {
            const { success, message } = result;

            if (!success)
               return res.status(HttpStatus.UNAUTHORIZED).json({
                  success: success,
                  message: message,
               });

            return res.json({
               success: success,
               message: message,
            });
         })
         .catch((err) => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
               success: false,
               message: HttpMessage.INTERNAL_SERVER_ERROR,
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
            return res
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, valid: null, message: HttpMessage.INTERNAL_SERVER_ERROR });
         });
   }

   async check(req, res) {
      const user_id = req.user_id;

      AuthService.check(user_id)
         .then((result) => {
            const { success, message, is_verify, user } = result;

            if (!success)
               return res
                  .status(HttpStatus.BAD_REQUEST)
                  .json({ success: success, is_verify, message, user });

            return res.json({ success: success, message, is_verify, user });
         })
         .catch((err) => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
               success: false,
               is_verify: null,
               message: HttpMessage.INTERNAL_SERVER_ERROR,
               user: null,
            });
         });
   }

   async resend(req, res) {
      const { username, accessToken } = req.body;

      await AuthService.sendMailAuthorizationCustomer(username, accessToken)
         .then((result) => {
            const { success, message } = result;

            if (!success)
               return res.status(HttpStatus.BAD_REQUEST).json({ success: success, message });

            return res.json({ success: success, message });
         })
         .catch((err) => {
            return res
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: HttpMessage.INTERNAL_SERVER_ERROR });
         });
   }
}

export default new AuthController();
