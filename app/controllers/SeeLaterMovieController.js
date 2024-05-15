import SeeLaterMovieService from '../../services/SeeLaterMovieService.js';

class SeeLaterMovieController {
   async getListSeeLaterMovieOfUser(req, res) {
      try {
         const { user_id, skip, limit, keySearch, sort } = req.body;

         const result = await SeeLaterMovieService.getOf({ user_id, skip, limit, keySearch, sort });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get seeLaterMovie failed!' });
      }
   }

   async checkIsSeeLaterMovie(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await SeeLaterMovieService.checkSeeLaterMovie({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get seeLaterMovie failed!' });
      }
   }

   async seeLaterMovie(req, res) {
      const { user_id, ref_id } = req.body;

      try {
         const result = await SeeLaterMovieService.add({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 29)');
         res.status(500).json({ success: false, message: 'SeeLaterMovie failed!' });
      }
   }

   async unseeLaterMovie(req, res) {
      try {
         const { user_id, ref_id } = req.query;

         const result = await SeeLaterMovieService.delete({ user_id, ref_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Get seeLaterMovie failed! (SeeLaterMovieController: Row - 91)',
         });
      }
   }
}

export default new SeeLaterMovieController();
