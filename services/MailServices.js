import nodemailer from 'nodemailer';

class MailServices {
   constructor() {
      try {
         this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: process.env.USERNAME_MAIL,
               pass: process.env.PASSWORD_MAIL,
            },
         });
      } catch (error) {}
   }

   async sendMail(toList, subject, message) {
      try {
         const mailOptions = {
            from: process.env.USERNAME_MAIL + '@gmail.com',
            to: toList.join(', '),
            subject: subject,
            text: message,
         };

         const result = await this.transporter.sendMail(mailOptions);

         return true;
      } catch (error) {
         console.log('Error sending email: ' + error.message);
         return false;
      }
   }

   async sendHtmlMail(toList, subject, message) {
      try {
         let mailOptions = {
            from: process.env.USERNAME_MAIL + '@gmail.com',
            to: toList.join(', '),
            subject: subject,
            html: message,
         };

         let result = await this.transporter.sendMail(mailOptions);

         return true;
      } catch (error) {
         console.log('Error sending email: ' + error.message);
         return false;
      }
   }

   async sendAttachmentMail(toList, subject, message, attachments) {
      try {
         let mailOptions = {
            from: process.env.USERNAME_MAIL + '@gmail.com',
            to: toList.join(', '),
            subject: subject,
            text: message,
            attachments: attachments,
         };

         let result = await this.transporter.sendMail(mailOptions);

         return true;
      } catch (error) {
         console.log('Error sending email: ' + error.message);
         return false;
      }
   }

   async sendAttachmentHtmlMail(toList, subject, message, attachments) {
      try {
         let mailOptions = {
            from: process.env.USERNAME_MAIL + '@gmail.com',
            to: toList.join(', '),
            subject: subject,
            html: message,
            attachments: attachments,
         };

         let result = await this.transporter.sendMail(mailOptions);

         return true;
      } catch (error) {
         console.log('Error sending email: ' + error.message);
         return false;
      }
   }
}

export default new MailServices();
