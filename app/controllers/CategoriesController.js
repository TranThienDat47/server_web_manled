import CategoryService from '../../services/CategoryService.js';
import { HttpMessage, HttpStatus } from '../../global/enumGlobal.js';

class CategoriesController {
   async show(req, res) {
      try {
         const _id = req.body._id;
         const result = await CategoryService.getOf(_id);

         if (!result.success) return res.status(HttpStatus.UNAUTHORIZED).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: HttpMessage.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async showAll(req, res) {
      try {
         const result = await CategoryService.getAll();

         if (!result.success) return res.status(HttpStatus.UNAUTHORIZED).json(result);

         return res.json(result);
      } catch (error) {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: HttpMessage.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async add(req, res) {
      const { title, description, parentID } = req.body;

      try {
         const result = await CategoryService.add({ title, description, parentID });

         if (!result.success) return res.status(HttpStatus.UNAUTHORIZED).json(result);

         return res.json(result);
      } catch (error) {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: HttpMessage.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async update(req, res) {
      const { title, description, parentID, _id } = req.body;

      try {
         const result = await CategoryService.update({ title, description, parentID }, _id);

         if (!result.success) return res.status(HttpStatus.UNAUTHORIZED).json(result);

         return res.json(result);
      } catch (error) {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: HttpMessage.INTERNAL_SERVER_ERROR,
         });
      }
   }

   async delete(req, res) {
      try {
         const { _id } = req.body;

         const result = await CategoryService.delete(_id);

         if (!result.success) return res.status(HttpStatus.UNAUTHORIZED).json(result);

         return res.json(result);
      } catch (error) {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${HttpMessage.INTERNAL_SERVER_ERROR}`,
         });
      }
   }
}

export default new CategoriesController();
