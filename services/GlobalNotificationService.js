import pkg from 'mongoose';

import GlobalNotifications from '../app/models/GlobalNotifications.js';
import GlobalNotificationDetails from '../app/models/GlobalNotificationDetails.js';
import Custommer from '../app/models/Custommer.js';

class GlobalNotificationService {
   async getWithCustomer(user_id, skip = -1, limit = Number.MAX_SAFE_INTEGER, valueSort = null) {
      try {
         const option = {
            skip,
            limit,
         };

         if (valueSort !== null) option[sort] = { timestamps: valueSort };

         const match = { $match: { user_id: pkg.Types.ObjectId(user_id) } };
         const lookup = {
            $lookup: {
               from: 'global_notifications',
               localField: 'gloab_notification_id',
               foreignField: '_id',
               as: 'globalNotification_info',
            },
         };

         const globalNotification = await GlobalNotificationDetails.aggregate([match, lookup]);

         return { success: true, globalNotification };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async addAll(obj = { ref_id, title, content }) {
      if (!obj.ref_id.trim() || !obj.title.trim() || !obj.content.trim()) {
         return {
            success: false,
            message: "'ref_id', 'title' and 'content' are required!",
         };
      }

      obj.ref_id = pkg.Types.ObjectId(obj.ref_id);

      try {
         const result = await Custommer.find({ is_block: false })
            .then(async (customers) => {
               const globalNotification = new GlobalNotifications(obj);
               return await globalNotification
                  .save()
                  .then(async (result) => {
                     const globalNotificationDetails = customers.map((element) => ({
                        user_id: element._id,
                        gloab_notification_id: result._id,
                     }));
                     return {
                        success: true,
                        globalNotification: result,
                        globalNotificationDetails: await GlobalNotificationDetails.insertMany(
                           globalNotificationDetails,
                        ).catch((error) => ({ success: false, message: error.message })),
                     };
                  })
                  .catch((error) => ({ success: false, message: error.message }));
            })
            .catch((error) => ({ success: false, message: error.message }));

         return result;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async addMany(customers = [], obj = { ref_id, title, content }) {
      if (!obj.ref_id.trim() || !obj.title.trim() || !obj.content.trim()) {
         return {
            success: false,
            message: "'ref_id', 'title' and 'content' are required!",
         };
      }

      obj.ref_id = pkg.Types.ObjectId(obj.ref_id);

      try {
         const globalNotification = new GlobalNotifications(obj);

         const result = await globalNotification
            .save()
            .then(async (result) => {
               const globalNotificationDetails = customers.map((element) => ({
                  user_id: element,
                  gloab_notification_id: result._id,
               }));
               return {
                  success: true,
                  globalNotification: result,
                  globalNotificationDetails: await GlobalNotificationDetails.insertMany(
                     globalNotificationDetails,
                  ).catch((error) => ({ success: false, message: error.message })),
               };
            })
            .catch((error) => ({ success: false, message: error.message }));

         return result;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async delete(_id) {
      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };

         const globalNotification = await GlobalNotifications.deleteOne(filter);

         if (!globalNotification)
            return {
               success: false,
               message: 'Global Notification not found or user not authoirised ',
            };

         return {
            success: true,
            globalNotification,
         };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async deleteAll() {
      try {
         const filter = {};

         const globalNotification = await GlobalNotifications.deleteMany(filter);

         if (!globalNotification)
            return {
               success: false,
               message: 'Global Notification not found or user not authoirised ',
            };

         return {
            success: true,
            globalNotification,
         };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }
}

export default new GlobalNotificationService();
