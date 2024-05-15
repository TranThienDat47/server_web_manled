import FollowService from '../../services/FollowService.js';

class FollowController {
   async getCountFollowOfProduct(req, res) {
      try {
         const { product_id } = req.params;

         const result = await FollowService.getCountFollowOfProduct({ product_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get follow failed!' });
      }
   }

   async getListFollowOfUser(req, res) {
      try {
         const { user_id, skip, limit, keySearch, sort } = req.body;

         const result = await FollowService.getOf({ user_id, skip, limit, keySearch, sort });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get follow failed!' });
      }
   }

   async checkIsFollow(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await FollowService.checkFollow({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get follow failed!' });
      }
   }

   async follow(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await FollowService.add({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 29)');
         res.status(500).json({ success: false, message: 'Follow failed!' });
      }
   }

   async unfollow(req, res) {
      try {
         const { user_id, ref_id } = req.query;

         const result = await FollowService.delete({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Get follow failed! (FollowController: Row - 91)',
         });
      }
   }
}

export default new FollowController();
