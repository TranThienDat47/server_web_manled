import GlobalNotificationService from '../../services/GlobalNotificationService.js';

class GlobalNotificationsController {
   async getWithCustomer(req, res) {
      const { user_id } = req.body;

      try {
         const result = await GlobalNotificationService.getWithCustomer(user_id);

         return res.json(result);
      } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
      }
   }

   async addAll(req, res) {
      const { ref_id, title, content } = req.body;

      try {
         const result = await GlobalNotificationService.addAll({ ref_id, title, content });

         return res.json(result);
      } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
      }
   }

   async addMany(req, res) {
      const { ref_id, title, content, customers } = req.body;

      try {
         const result = await GlobalNotificationService.addMany(customers, {
            ref_id,
            title,
            content,
         });

         return res.json(result);
      } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
      }
   }
}

export default new GlobalNotificationsController();
