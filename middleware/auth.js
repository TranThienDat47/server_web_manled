import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
   const authHeader = req.header('Authorization');
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      res.json({ success: false, is_verify: false, message: 'Authentication failed!' });
   } else {
      try {
         const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         req.user_id = decode.user_id;
         next();
      } catch (error) {
         return res.status(403).json({ success: false, message: 'Invalid token', error });
      }
   }
};

export default verifyToken;
