import nodemailer from 'nodemailer';

export const sendMail = async (to, suject, htmlContent) => {
   let transporter;
   try {
      transporter = await nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 587,
         secure: false,
         type: 'oauth2',
         auth: {
            user: process.env.USERNAME_MAIL,
            pass: process.env.PASSWORD_MAIL,
         },
      });
   } catch (error) {
      console.log(error, '(Row - 17)');
   }

   try {
      await transporter.sendMail(
         {
            from: process.env.USERNAME_MAIL + '@gmail.com',
            to: to,
            subject: suject,
            html: htmlContent,
         },
         (err) => {
            if (err) console.log(err);
         },
      );
   } catch (error) {
      console.log(error, '(Row - 33)');
   }
};
