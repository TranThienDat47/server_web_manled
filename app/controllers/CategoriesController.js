import CategoryService from '../../services/CategoryService.js';

class CategoriesController {
   async show(req, res) {
      try {
         const _id = req.body._id;
         const result = await CategoryService.getAll(_id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 9)');
         res.status(500).json({ success: false, message: 'Get categories failed!' });
      }
   }

   async add(req, res) {
      const { title, description, parentID } = req.body;

      try {
         const result = await CategoryService.add({ title, description, parentID });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 29)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async update(req, res) {
      const { title, description, parentID, _id } = req.body;

      try {
         const result = await CategoryService.update({ title, description, parentID }, _id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: 'Updated categories failed!' });
      }
   }

   async delete(req, res) {
      try {
         const { _id } = req.body;

         const result = await CategoryService.delete(_id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Get categories failed! (CategoriesController: Row - 91)',
         });
      }
   }
}

export default new CategoriesController();
