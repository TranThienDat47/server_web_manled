import NotificationService from '../../services/NotificationService.js';

class NotificationsController {
   async show(req, res) {
      const { user_id } = req.body;

      try {
         const LENGTH_NOTIFICATION = 8;

         const result = await NotificationService.search({ user_id }, 0, LENGTH_NOTIFICATION, -1);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   async likeComment(req, res) {
      const { ref_id, user_id, comment } = req.body;

      if (!comment.trim())
         return res.status(400).json({
            success: false,
            message: "'comment' is required!",
         });

      const title = 'Ai đó đã thích bình luận của bạn';
      const content = `Ai đó đã thích bình luận của bạn: ${comment}`;

      try {
         const result = await NotificationService.add({ ref_id, user_id, title, content });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   async replyComment(req, res) {
      const { ref_id, user_id, comment } = req.body;

      if (!comment.trim())
         return res.status(400).json({
            success: false,
            message: "'comment' is required!",
         });

      const customer = await CustomerServices.getOne(user_id).catch((error) => {
         return res.status(500).json({ success: false, message: error.message });
      });

      if (!customer.success) return res.status(401).json(result);

      const fullNameCustomer = customer.customers.first_name + customer.customers.last_name;

      const title = `<strong>${fullNameCustomer}</strong> đã thích bình luận của bạn`;
      const content = `<strong>${fullNameCustomer}</strong> đã trả lời về bình luận của bạn: ${comment}`;

      try {
         const result = await NotificationService.add({ ref_id, user_id, title, content });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   async delete(req, res) {
      const { _id } = req.body;

      try {
         const result = await NotificationService.delete(_id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   async deleteAll(req, res) {
      try {
         const result = await NotificationService.deleteAll();

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: error.message });
      }
   }
}

export default new NotificationsController();
