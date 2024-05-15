import SeenMovieService from '../../services/SeenMovieService.js';

class SeenMovieController {
   async getListSeenMovieOfUser(req, res) {
      try {
         const { user_id, skip, limit, keySearch, sort } = req.body;

         const result = await SeenMovieService.getOf({ user_id, skip, limit, keySearch, sort });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get seenMovie failed!' });
      }
   }

   async checkIsSeenMovie(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await SeenMovieService.checkSeenMovie({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get seenMovie failed!' });
      }
   }

   async seenMovie(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await SeenMovieService.add({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 29)');
         res.status(500).json({ success: false, message: 'SeenMovie failed!' });
      }
   }

   async unseenMovie(req, res) {
      try {
         const { user_id, ref_id } = req.query;

         const result = await SeenMovieService.delete({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Get seenMovie failed! (SeenMovieController: Row - 91)',
         });
      }
   }
}

export default new SeenMovieController();
