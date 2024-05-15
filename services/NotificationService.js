import Notifications from '../app/models/Notifications.js';

class NotificationService {
   async search(filter = {}, skip = -1, limit = Number.MAX_SAFE_INTEGER, valueSort = null) {
      try {
         const option = {
            skip,
            limit,
         };

         if (valueSort !== null) option.sort = { createdAt: valueSort };

         const notification = await Notifications.find(filter, {}, option);

         return { success: true, notification };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async countUnreadNotifications(user_id = null) {
      try {
         const filter = {
            user_id: user_id,
            read: false,
         };

         const count = await Notifications.countDocuments(filter);

         return { success: true, count };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async add(obj = { ref_id, user_id, user_send_id, title, content }) {
      if (
         !obj.ref_id.trim() ||
         !obj.user_id.trim() ||
         !obj.user_send_id.trim() ||
         !obj.title.trim() ||
         !obj.content.trim()
      )
         return {
            success: false,
            message: "'ref_id', 'user_id', 'user_send_id', 'title' and 'content' are required!",
         };

      try {
         const notification = new Notifications(obj);

         await notification.save();

         return { success: true, notification };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async read(temp = []) {
      try {
         if (!!temp.length) {
            await Promise.all(
               temp.map(async (element) => {
                  await Notifications.findOneAndUpdate({ _id: element._id }, { read: true }).then(
                     (res) => {},
                  );
               }),
            );

            return { success: true };
         }
         return { success: true };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async delete(_id) {
      try {
         const filter = { _id: pkg.Schema.Types.ObjectId(_id) };

         const notification = await Notifications.deleteOne(filter);

         if (!notification)
            return {
               success: false,
               message: 'notification not found or user not authoirised ',
            };

         return {
            success: true,
            notification,
         };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async deleteAll() {
      try {
         const filter = {};

         const notification = await Notifications.deleteMany(filter);

         if (!notification)
            return {
               success: false,
               message: 'notification not found or user not authoirised ',
            };

         return {
            success: true,
            notification,
         };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }
}

export default new NotificationService();
