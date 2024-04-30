import SavedService from '../../services/SavedService.js';

class SavedController {
   async getListSavedOfUser(req, res) {
      try {
         const user_id = req.body.user_id;
         const result = await SavedService.getOf({ user_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get saved failed!' });
      }
   }

   async checkIsSaved(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await SavedService.checkSaved({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get saved failed!' });
      }
   }

   async saved(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await SavedService.add({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 29)');
         res.status(500).json({ success: false, message: 'Saved failed!' });
      }
   }

   async unSaved(req, res) {
      try {
         const { user_id, ref_id } = req.body;

         const result = await SavedService.delete({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Get saved failed! (SavedController: Row - 91)',
         });
      }
   }
}

export default new SavedController();
